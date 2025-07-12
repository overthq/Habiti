import { AppContext } from '../utils/context';

export type Resolver<K = any, R = any> = (
	parent: any,
	args: K,
	ctx: AppContext,
	info: any
) => R;
