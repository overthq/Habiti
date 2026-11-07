import format from 'date-fns/format';

export const relativeTimestamp = (timestamp: string) => {
	return format(new Date(timestamp), 'MMM d, yyyy');
};
