import { parseISO } from 'date-fns';
import format from 'date-fns/format';

console.log(format(new Date(), 'dd LLL'));

// Something like "29 Sep"? (at least, for now)
export const relativeTimeStamp = (timestamp: string) => {
	return format(parseISO(timestamp), 'dd LLL');
};
