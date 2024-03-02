import { format, fromUnixTime } from 'date-fns';

export const parseTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp) / 1000), `MMMM do',' yyy`);
};
