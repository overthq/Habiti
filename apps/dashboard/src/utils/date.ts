import { format, formatDistanceToNow } from 'date-fns';
import type { Locale } from 'date-fns';

export const parseTimestamp = (timestamp: string) => {
	return format(new Date(timestamp), `MMMM do',' yyy`);
};

const shortFormatDistance: Locale['formatDistance'] = (
	token,
	count,
	options
) => {
	const units: Record<string, string> = {
		xSeconds: `${count}s`,
		halfAMinute: '30s',
		lessThanXSeconds: `${count}s`,
		lessThanXMinutes: `${count}m`,
		xMinutes: `${count}m`,
		aboutXHours: `${count}h`,
		xHours: `${count}h`,
		xDays: `${count}d`,
		aboutXWeeks: `${count}w`,
		xWeeks: `${count}w`,
		aboutXMonths: `${count} mo`,
		xMonths: `${count} mo`,
		aboutXYears: `${count} yr`,
		xYears: `${count} yr`,
		overXYears: `${count} yr`,
		almostXYears: `${count} yr`
	};
	const result = units[token] ?? '';
	if (options?.addSuffix) {
		return options.comparison && options.comparison > 0
			? `in ${result}`
			: `${result} ago`;
	}
	return result;
};

const shortLocale: Pick<Locale, 'formatDistance'> = {
	formatDistance: shortFormatDistance
};

export const relativeDate = (date: string) => {
	return formatDistanceToNow(new Date(date), {
		addSuffix: true,
		locale: shortLocale as Locale
	});
};
