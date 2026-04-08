import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { AppEnv } from '../types/hono';
import { zodHook } from '../utils/validation';
import { optionalAuth } from '../middleware/auth';
import * as SearchLogic from '../core/logic/search';
import * as Schemas from '../core/validations/rest';

const search = new Hono<AppEnv>();

search.get(
	'/',
	optionalAuth,
	zValidator('query', Schemas.searchQuerySchema, zodHook),
	async c => {
		const { query } = c.req.valid('query');

		const { products, stores } = await SearchLogic.globalSearch(c, query);
		return c.json({ products, stores });
	}
);

export default search;
