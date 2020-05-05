import express from 'express';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import schema from './schema';
import './config/database';

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(cors());
app.use(
	'/',
	graphqlHTTP({
		schema,
		graphiql: true,
		customFormatErrorFn: ({ message, stack }) => {
			console.log('message', message);
			console.log('stack', stack);
		}
	})
);

app.listen(Number(PORT), () => console.log(`Server started on port ${PORT}`));
