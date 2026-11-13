import prisma from '../config/prisma';
import { OrderStatus } from '../generated/prisma/client';
import { updateOrderStatus } from '../core/data/orders';
import { runSerializable } from '../utils/prisma';

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

	console.log(
		`Found ${staleOrders.length} stale ReadyForPickup orders (older than ${PICKUP_CONFIRMATION_WINDOW_DAYS} days)`
	);

	let completed = 0;

	for (const order of staleOrders) {
		// The order may have been cancelled or confirmed since the query above.
		// Re-check in the same transaction so its money only moves once.
		const didComplete = await runSerializable(prisma, async tx => {
			const current = await tx.order.findUnique({ where: { id: order.id } });
			if (current?.status !== OrderStatus.ReadyForPickup) return false;

			await updateOrderStatus(tx, current, OrderStatus.Completed);
			return true;
		});

		if (!didComplete) continue;

		completed++;
		console.log(`Completed order ${order.id} (store: ${order.storeId})`);
	}

	console.log(`Done. Completed ${completed} of ${staleOrders.length} orders.`);
}

completeStalePickups()
	.catch(error => {
		console.error('Failed to complete stale pickups:', error);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
