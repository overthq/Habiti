import express from 'express';
import { gql } from 'graphql-request';
import { promisify } from 'util';

import generateToken from './utils/generateToken';
import { sendVerificationCode } from './utils/verificationCode';
import { graphqlClient, redisClient } from './config';

const app = express();

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

		if (data?.users[0]) {
			sendVerificationCode(phone);

			return res.status(200).json({
				success: true,
				message: 'Verification code sent to associated phone number'
			});
		}

		return res.status(404).json({
			success: false,
			message: 'The specified user does not exist'
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

app.post('/register', async (req, res) => {
	const { name, phone } = req.body;

	try {
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

		const [user] = data.insert_users.returning;

		if (user.id) {
			sendVerificationCode(phone);

			return res.status(201).json({
				success: true,
				message:
					'Account created successfully. Please enter the verification code sent to the specified phone number.'
			});
		}
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

app.post('/verify-code', async (req, res) => {
	const { phone, code, userType } = req.body;

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

		const { accessToken } = generateToken({ ...user, userType });

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
