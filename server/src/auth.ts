import { RequestHandler } from 'express';

const authenticate = (req, res) => {
	const { phone } = req.body;

	// Find the user with the given phone number, if it exists
	// Generate a random 6-digit code, and store it in Redis.
	// Send the code the the user's phone number
	// TODO: Create account recovery strategy.
	return res.status(200).json({
		success: true,
		message:
			'Please verify your identity by entering the code sent to your phone number.'
	});
};

const register = (req, res) => {
	const { name, phone } = req.body;

	// Create a user with the provided details, except if one with the same unique information already exists.
};

const verifyCode = (req, res) => {
	const { phone, code } = req.body;

	// Check if the provided phone number and auth pair are in the Redis cache.
	// If they are, proceed to authenticate the user by:
	// Creating a jwt, using the application's secret key, and some of the user's information.
	// Sending the jwt back in the response.
	// Postgraphile will verify the authenticity of this token on subsequent requests (at least I think it should be able to!)
};
