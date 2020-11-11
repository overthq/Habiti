import express from 'express';
import redis from 'redis';
import { GraphQLClient, gql } from 'graphql-request';
import { promisify } from 'util';

import generateToken from './utils/generateToken';
import generateCode from './utils/generateCode';

const app = express();

const redisClient = redis.createClient();
const graphqlClient = new GraphQLClient('http://localhost:8080/v1/graphql');
const getAsync = promisify(redisClient.get).bind(redisClient);

app.use(express.json());

app.post('/authenticate', async (req, res) => {
	const { phone } = req.body;

	try {
		const data = await graphqlClient.request(
			gql`
				query User($phone: String!) {
					users(where: { phone: { _eq: $phone } }) {
						id
						name
						phone
					}
				}
			`,
			{ phone }
		);

		if (!data.users || !data.users[0]) {
			return res.status(404).json({
				success: 'false',
				message: 'The specified user does not exist'
			});
		}

		const code = generateCode();

		redisClient.set('phone', code);

		if (process.env.NODE_ENV === 'development') {
			console.log(code);
		} else {
			// Send code via Twilio.
		}
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'An error occured'
		});
	}
});

app.post('/register', async (req, res) => {
	const { name, phone } = req.body;

	const data = await graphqlClient.request(
		gql`
			mutation Register($name: String!, $phone: String!) {
				insert_users(objects: [{ name: $name, phone: $phone }]) {
					returning {
						id
						name
						phone
					}
				}
			}
		`,
		{ name, phone }
	);

	console.log({ data });

	if (data.returning.id) {
		return res.status(201).json({
			success: false,
			message:
				'Account created successfully. Please enter the verification code sent to the specified phone number.'
		});
	}
});

app.post('/verify-code', async (req, res) => {
	const { phone, code } = req.body;

	try {
		const verificationCode = await getAsync(phone);

		if (!verificationCode) {
			throw new Error(
				'There is no verification code for the specified phone number. Maybe it has expired. Try authenticating again.'
			);
		}

		if (verificationCode !== code) {
			throw new Error('Wrong verification code entered. Please try again.');
		}

		const data = await graphqlClient.request(
			gql`
				query User($phone: String!) {
					users(where: { phone: { _eq: $phone } }) {
						id
						name
						phone
					}
				}
			`,
			{ phone }
		);

		const [user] = data.users;

		console.log({ data, user });

		const { accessToken } = generateToken(user);

		return res.status(200).json({
			success: true,
			message: 'Verification complete.',
			data: { accessToken }
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

app.listen(Number(process.env.PORT) || 3000, () => {
	console.log(
		`Authentication server listening on port ${process.env.PORT || 3000}`
	);
});
