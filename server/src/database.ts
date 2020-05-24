import Knex from 'knex';
import { createSqlmancerClient } from 'sqlmancer';

const knex = Knex({
	client: 'pg',
	connection: process.env.PG_CONNECTION_STRING,
	debug: process.env.NODE_ENV === 'development'
});

export const client = createSqlmancerClient(`${__dirname}/schema.ts`, knex);
