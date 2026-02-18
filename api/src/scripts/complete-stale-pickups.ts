import prisma from '../config/prisma';
import { OrderStatus } from '../generated/prisma/client';
import { updateStoreRevenue } from '../core/data/stores';

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

	for (const order of staleOrders) {
		await prisma.order.update({
			where: { id: order.id },
			data: { status: OrderStatus.Completed }
		});

		await updateStoreRevenue(prisma, {
			storeId: order.storeId,
			total: order.total
		});

		console.log(`Completed order ${order.id} (store: ${order.storeId})`);
	}

	console.log('Done.');
}

completeStalePickups()
	.catch(error => {
		console.error('Failed to complete stale pickups:', error);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
