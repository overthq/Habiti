import { timingSafeEqual } from 'crypto';

export const timingSafeEqualString = (a: string, b: string): boolean => {
	if (a.length !== b.length) return false;
	if (a.length === 0) return false;

	const ab = Buffer.from(a, 'utf8');
	const bb = Buffer.from(b, 'utf8');

	return timingSafeEqual(ab, bb);
};
