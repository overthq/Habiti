import prisma from '../config/prisma';
import { NotificationType } from '../core/notifications';
import {
	expirePaymentPendingOrders,
	paymentPendingExpiryMs,
	type ExpiredPaymentPendingOrder
} from '../core/logic/payments';
import { rootLogger } from '../services/logger';

/**
 * Cancels orders still awaiting payment after Paystack Checkout's transfer
 * window and releases the stock they hold.
 *
 * Checkout keeps a Pay with Transfer account open for about 30 minutes
 * (`PAYSTACK_CHECKOUT_TRANSFER_WINDOW_MS`). This waits that long plus
 * `PAYMENT_PENDING_EXPIRY_GRACE_MS` so a transfer sent near the deadline can
 * still settle as `charge.success`. Set `PAYMENT_PENDING_EXPIRY_MINUTES` to
 * replace that whole window.
 *
 * There is no in-process scheduler. Run every few minutes:
 *   cd api && bun run expire-pending-payments
 */

const overrideMinutes = (() => {
	const raw = process.env.PAYMENT_PENDING_EXPIRY_MINUTES;

	if (raw == null || raw === '') return undefined;

	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : undefined;
})();

const notifyShoppers = async (orders: ExpiredPaymentPendingOrder[]) => {
	const withTokens = orders.filter(order => order.pushTokens.length > 0);

	if (withTokens.length === 0) return;

	if (!process.env.REDIS_URL && !process.env.REDIS_TLS_URL) {
		rootLogger.warn(
			{ count: withTokens.length },
			'expire_pending_payments.notifications_skipped'
		);
		return;
	}

	const { getServices } = await import('../dependencies');
	const notifications = getServices().notifications;

	await Promise.all(
		withTokens.map(order =>
			notifications.queueNotification({
				type: NotificationType.OrderCancelled,
				data: { orderId: order.id },
				recipientTokens: order.pushTokens
			})
		)
	);
};

async function expirePendingPayments() {
	const expiryMs = paymentPendingExpiryMs(overrideMinutes);

	const expired = await expirePaymentPendingOrders(prisma, {
		expiryMs,
		logger: rootLogger
	});

	rootLogger.info(
		{ expired: expired.length, expiryMs },
		'expire_pending_payments.complete'
	);

	await notifyShoppers(expired);
}

expirePendingPayments()
	.catch(error => {
		rootLogger.error({ err: error }, 'expire_pending_payments.errored');
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
