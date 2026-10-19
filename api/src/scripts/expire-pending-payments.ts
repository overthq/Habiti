import prisma from '../config/prisma';
import { OrderStatus, PushTokenType } from '../generated/prisma/client';
import {
	restoreProductQuantities,
	updateOrderStatus
} from '../core/data/orders';
import { NotificationType } from '../core/notifications';
import { rootLogger } from '../services/logger';
import { runSerializable } from '../utils/prisma';
import { getServices } from '../dependencies';

/**
 * Cancels orders still awaiting payment after Paystack Checkout's transfer
 * window (about 30 minutes, plus a 5 minute grace) and releases their stock.
 *
 * Run every few minutes: cd api && bun run expire-pending-payments
 */

const EXPIRY_MINUTES = parseInt(
	process.env.PAYMENT_PENDING_EXPIRY_MINUTES || '35',
	10
);

async function expirePendingPayments() {
	const cutoff = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

	const staleOrders = await prisma.order.findMany({
		where: { status: OrderStatus.PaymentPending, createdAt: { lt: cutoff } },
		include: {
			products: true,
			user: {
				include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
			}
		}
	});

	let expired = 0;

	for (const order of staleOrders) {
		// A charge may have paid the order since the query above. Re-check in
		// the same transaction as the restock so it is never unwound.
		const cancelled = await runSerializable(prisma, async tx => {
			const current = await tx.order.findUnique({ where: { id: order.id } });

			if (current?.status !== OrderStatus.PaymentPending) return false;

			await restoreProductQuantities(tx, { products: order.products });
			await updateOrderStatus(tx, current, OrderStatus.Cancelled);

			return true;
		});

		if (!cancelled) continue;

		expired++;
		rootLogger.info({ orderId: order.id }, 'payment_pending.expired');

		if (order.user.pushTokens.length > 0) {
			await getServices().notifications.queueNotification({
				type: NotificationType.OrderCancelled,
				data: { orderId: order.id },
				recipientTokens: order.user.pushTokens.map(token => token.token)
			});
		}
	}

	rootLogger.info(
		{ found: staleOrders.length, expired, expiryMinutes: EXPIRY_MINUTES },
		'expire_pending_payments.complete'
	);
}

expirePendingPayments()
	.catch(error => {
		rootLogger.error({ err: error }, 'expire_pending_payments.failed');
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
