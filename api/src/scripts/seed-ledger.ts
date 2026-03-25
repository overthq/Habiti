import prisma from '../config/prisma';
import { TransactionType } from '../generated/prisma/client';

/**
 * One-time migration script to seed the Transaction ledger.
 * Creates an opening balance Adjustment transaction for each store
 * based on its current realizedRevenue and paidOut values.
 *
 * Run: cd api && bun run src/scripts/seed-ledger.ts
 */
async function seedLedger() {
	const stores = await prisma.store.findMany({
		select: {
			id: true,
			name: true,
			realizedRevenue: true,
			paidOut: true
		}
	});

	console.log(`Found ${stores.length} stores to seed.`);

	let seeded = 0;
	let skipped = 0;

	for (const store of stores) {
		// Check if this store already has transactions (idempotent)
		const existingTx = await prisma.transaction.findFirst({
			where: { storeId: store.id }
		});

		if (existingTx) {
			console.log(
				`Skipping store "${store.name}" (${store.id}) — already has transactions.`
			);
			skipped++;
			continue;
		}

		const availableBalance = store.realizedRevenue - store.paidOut;

		if (availableBalance === 0) {
			console.log(
				`Skipping store "${store.name}" (${store.id}) — zero balance.`
			);
			skipped++;
			continue;
		}

		await prisma.transaction.create({
			data: {
				storeId: store.id,
				type: TransactionType.Adjustment,
				amount: Math.abs(availableBalance),
				balanceAfter: availableBalance,
				description: 'Opening balance'
			}
		});

		console.log(
			`Seeded store "${store.name}" (${store.id}) with opening balance: ${availableBalance}`
		);
		seeded++;
	}

	console.log(`Done. Seeded: ${seeded}, Skipped: ${skipped}.`);
}

seedLedger()
	.catch(error => {
		console.error('Failed to seed ledger:', error);
		process.exit(1);
	})
	.finally(() => {
		prisma.$disconnect();
	});
