// Because of the nature of the app, users will initially bear the cost of the paystack fees
// We will present this to them in a manner that makes it understandable.
// We will also take a 5% fee on every transaction.

// TODO: It is sufficient to handle all of this on the frontend
// for now, since all calculations are context free
// Once discounts and other factors come in, this should move
// server-side.

export const calculatePaystackFee = (total: number) => {
	// Total is in kobo
	const raw = 0.015 * total + 10000;
	return raw > 200000 ? 200000 : raw;
};

export const calculateMarketFee = () => {
	return 100000;
};
