import { AppContext } from '../../utils/context';
import * as SearchData from '../data/search';

export const globalSearch = async (ctx: AppContext, query: string) => {
	return SearchData.globalSearch(ctx.prisma, query, {
		includeUnlisted: !ctx.isAdmin
	});
};
