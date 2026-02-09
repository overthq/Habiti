import { format } from 'date-fns';

export const parseTimestamp = (timestamp: string) => {
	return format(new Date(timestamp), `MMMM do',' yyy`);
};
