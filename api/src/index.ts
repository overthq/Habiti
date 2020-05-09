import express from 'express';
import graphqlHTTP from 'express-graphql';
import jwt from 'express-jwt';
import cors from 'cors';
import schema from './schema';
import './config/database';

const { PORT } = process.env;
const app = express();

const authMiddleware = jwt({
	secret: process.env.JWT_SECRET,
	credentialsRequired: false
});

app.use(express.json());
app.use(cors());
app.use('/', authMiddleware, graphqlHTTP({ schema, graphiql: true }));

app.listen(Number(PORT), () => console.log(`Server started on port ${PORT}`));
