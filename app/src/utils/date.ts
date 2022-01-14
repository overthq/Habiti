import { fromUnixTime } from 'date-fns';
import format from 'date-fns/format';

console.log(format(new Date(), 'dd LLL'));

// Something like "29 Sep"? (at least, for now)
export const relativeTimestamp = (timestamp: string) => {
	return format(fromUnixTime(Number(timestamp)), 'dd LLL');
};
