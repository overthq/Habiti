import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';

// Something like "29 Sep"? (at least, for now)
export const relativeTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp) / 1000), 'dd MMM yyyy');
};
