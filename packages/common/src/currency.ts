// TODO: When supporting other currencies in the future,
// rename this and allow passing other currencies as an argument.
// It should be just as simple as changing the locale and currency key here.

export const formatNaira = (amountInKobo: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	}).format(amountInKobo / 100);
};
