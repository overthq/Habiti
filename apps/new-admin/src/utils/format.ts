// TODO: Use @habiti/common package instead

export const formatNaira = (amountInKobo: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	}).format(amountInKobo / 100);
};
