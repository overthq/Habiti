import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';

export const relativeTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp) / 1000), 'dd MMM yyyy');
};
