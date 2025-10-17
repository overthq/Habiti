import { formatDistance } from 'date-fns';

export const formatDate = (rawDate: string) => {
	return new Date(rawDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

export const daysAgo = (rawDate: string) => {
	formatDistance(new Date(rawDate), new Date(), { addSuffix: true });
};
