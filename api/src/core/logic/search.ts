import { AppContext } from '../../utils/context';
import * as SearchData from '../data/search';

export const globalSearch = async (ctx: AppContext, query: string) => {
	const isAdmin = await ctx.isAdmin();

	return SearchData.globalSearch(ctx.prisma, query, {
		includeUnlisted: isAdmin
	});
};
