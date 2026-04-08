import type { Context } from 'hono';

import type { AppEnv } from '../../types/hono';
import * as SearchData from '../data/search';

export const globalSearch = async (c: Context<AppEnv>, query: string) => {
	return SearchData.globalSearch(c.var.prisma, query, {
		includeUnlisted: !c.var.isAdmin
	});
};
