export const formatDate = (rawDate: string) => {
	return new Date(rawDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

export const formatDateFromTimestamp = (rawDate: string) => {
	return new Date(Number(rawDate)).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};
