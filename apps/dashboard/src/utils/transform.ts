import { BANKS } from './banks';

export const BANKS_BY_CODE = BANKS.reduce(
	(acc, next) => {
		acc[next.code] = next;
		return acc;
	},
	{} as Record<string, (typeof BANKS)[number]>
);
