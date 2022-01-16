// TODO: When supporting other currencies in the future,
// rename this and allow passing other currencies as an argument.

export const formatNaira = (amountInKobo: number) => {
	return `\u20A6${(amountInKobo / 100).toFixed(2)}`;
};
