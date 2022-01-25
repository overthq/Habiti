import { format, fromUnixTime } from 'date-fns';

// Something like "29 Sep"? (at least, for now)
export const relativeTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp)), 'dd LLL yyyy');
};

export const parseTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp) / 1000), 'dd MMM yyy');
};
