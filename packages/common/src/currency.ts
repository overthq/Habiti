// TODO: When supporting other currencies in the future,
// rename this and allow passing other currencies as an argument.
// It should be just as simple as changing the locale and currency key here.

export const formatNaira = (amountInKobo: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	}).format(amountInKobo / 100);
};

export const formatNairaAbbreviated = (amountInKobo: number) => {
	const amountInNaira = amountInKobo / 100;

	// If amount is less than 100,000 Naira, use the regular format
	if (amountInNaira < 100000) {
		return formatNaira(amountInKobo);
	}

	// For millions (1,000,000 and above)
	if (amountInNaira >= 1000000) {
		const millions = amountInNaira / 1000000;
		return `₦${millions.toFixed(1)}m`;
	}

	// For thousands (100,000 to 999,999)
	const thousands = amountInNaira / 1000;
	return `₦${thousands.toFixed(1)}k`;
};
