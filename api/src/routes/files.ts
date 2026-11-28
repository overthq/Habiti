import { Hono } from 'hono';
import path from 'path';

import { LOCAL_UPLOADS_DIR } from '../utils/upload';
import type { AppEnv } from '../types/hono';

const files = new Hono<AppEnv>();

files.get('/:name{[a-f0-9-]+\\.(jpg|png|webp|gif)}', async c => {
	const file = Bun.file(path.join(LOCAL_UPLOADS_DIR, c.req.param('name')));

	if (!(await file.exists())) return c.notFound();

	return new Response(file, {
		headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
	});
});

export default files;
