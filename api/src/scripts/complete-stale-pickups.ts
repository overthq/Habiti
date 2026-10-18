import prisma from '../config/prisma';
import { OrderStatus } from '../generated/prisma/client';
import { updateOrderStatus } from '../core/data/orders';
import { runSerializable } from '../utils/prisma';
import { rootLogger } from '../services/logger';

const PICKUP_CONFIRMATION_WINDOW_DAYS = parseInt(
	process.env.PICKUP_CONFIRMATION_WINDOW_DAYS || '5',
	10
);

async function completeStalePickups() {
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - PICKUP_CONFIRMATION_WINDOW_DAYS);

	const staleOrders = await prisma.order.findMany({
		where: {
			status: OrderStatus.ReadyForPickup,
			updatedAt: { lt: cutoff }
		}
	});

	rootLogger.info(
		{
			count: staleOrders.length,
			windowDays: PICKUP_CONFIRMATION_WINDOW_DAYS
		},
		'complete_stale_pickups.start'
	);

	for (const order of staleOrders) {
		await runSerializable(prisma, tx =>
			updateOrderStatus(tx, order, OrderStatus.Completed)
		);

		rootLogger.info(
			{ orderId: order.id, storeId: order.storeId },
			'complete_stale_pickups.completed'
		);
	}

	rootLogger.info(
		{ completed: staleOrders.length },
		'complete_stale_pickups.complete'
	);
}

completeStalePickups()
	.catch(err => {
		rootLogger.error({ err }, 'complete_stale_pickups.failed');
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
