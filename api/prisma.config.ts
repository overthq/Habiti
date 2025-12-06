import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	datasource: {
		// We cannot use the `env` function from 'prisma/config', because we don't
		// need DATABASE_URL in CI (`prisma generate` does not need a db url).
		url: process.env.DATABASE_URL!
	}
});
