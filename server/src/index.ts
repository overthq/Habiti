import express from 'express';
import auth from './auth';

const app = express();

app.use(express.json());
app.use('/auth', auth);

// Use native http library to support websockets and subscriptions
app.listen(Number(process.env.PORT), () => {
	console.log('App running on port');
});
