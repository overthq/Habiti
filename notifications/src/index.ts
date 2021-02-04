import express from 'express';

const app = express();

// TODO: Use GraphQL subscriptions to watch for specific changes, and emit notifications based on them.

app.use(express.json());

app.listen(process.env.PORT, () => {
	console.log(`Server running at port ${process.env.PORT}`);
});

console.log('Hello world');
