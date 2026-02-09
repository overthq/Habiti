import { APIException } from '../../types/errors';
import logger from '../../utils/logger';

export class LogicError extends Error {
	public readonly code: LogicErrorCode;

	constructor(code: LogicErrorCode, message?: string) {
		super(message ?? code);
		this.name = 'LogicError';
		this.code = code;
	}
}

export enum LogicErrorCode {
	NotAuthenticated = 'NotAuthenticated',
	Forbidden = 'Forbidden',
	CannotManageStore = 'CannotManageStore',

	NotFound = 'NotFound',
	UserNotFound = 'UserNotFound',
	StoreNotFound = 'StoreNotFound',
	OrderNotFound = 'OrderNotFound',
	CardNotFound = 'CardNotFound',
	CartNotFound = 'CartNotFound',
	AdminNotFound = 'AdminNotFound',

	InvalidInput = 'InvalidInput',
	ValidationFailed = 'ValidationFailed',
	InvalidCredentials = 'InvalidCredentials',
	InvalidToken = 'InvalidToken',
	TokenExpired = 'TokenExpired',
	TokenReused = 'TokenReused',

	InvalidQuantity = 'InvalidQuantity',
	NegativeQuantity = 'NegativeQuantity',

	AlreadyFollowing = 'AlreadyFollowing',
	NotFollowing = 'NotFollowing',
	CannotRemoveLastManager = 'CannotRemoveLastManager',

	InsufficientFunds = 'InsufficientFunds',
	NoAccountDetails = 'NoAccountDetails',
	StoreContextRequired = 'StoreContextRequired',

	OrderInvalidStatusTransition = 'OrderInvalidStatusTransition',
	OrderNotPayable = 'OrderNotPayable',

	ProductNotFound = 'ProductNotFound',
	ProductStoreMismatch = 'ProductStoreMismatch',
	ProductInvalidRating = 'ProductInvalidRating',
	ProductStoreNotFound = 'ProductStoreNotFound',

	PayoutInsufficientFunds = 'PayoutInsufficientFunds',

	PaymentFailed = 'PaymentFailed',

	Unexpected = 'Unexpected',

	CartEmpty = 'CartEmpty',
	InsufficientStock = 'InsufficientStock'
}

export const logicErrorToApiException = (
	error: LogicErrorCode
): APIException => {
	switch (error) {
		case LogicErrorCode.NotAuthenticated:
			return new APIException(401, 'Authentication required');
		case LogicErrorCode.Forbidden:
			return new APIException(403, 'Forbidden');

		case LogicErrorCode.CannotManageStore:
			return new APIException(403, 'Unauthorized: Cannot manage store');

		case LogicErrorCode.UserNotFound:
			return new APIException(404, 'User not found');
		case LogicErrorCode.StoreNotFound:
			return new APIException(404, 'Store not found');
		case LogicErrorCode.OrderNotFound:
			return new APIException(404, 'Order not found');
		case LogicErrorCode.CardNotFound:
			return new APIException(404, 'Card not found');
		case LogicErrorCode.AdminNotFound:
			return new APIException(404, 'Admin not found');
		case LogicErrorCode.NotFound:
			return new APIException(404, 'Not found');

		case LogicErrorCode.InvalidCredentials:
			return new APIException(401, 'Invalid credentials');
		case LogicErrorCode.InvalidToken:
			return new APIException(401, 'Invalid token');
		case LogicErrorCode.TokenExpired:
			return new APIException(401, 'Token expired');
		case LogicErrorCode.TokenReused:
			return new APIException(401, 'Token reused');

		case LogicErrorCode.InvalidInput:
		case LogicErrorCode.ValidationFailed:
			return new APIException(400, 'Invalid request');

		case LogicErrorCode.InvalidQuantity:
			return new APIException(400, 'Quantity must be greater than 0');
		case LogicErrorCode.NegativeQuantity:
			return new APIException(400, 'Quantity cannot be negative');

		case LogicErrorCode.AlreadyFollowing:
			return new APIException(409, 'Already following this store');
		case LogicErrorCode.NotFollowing:
			return new APIException(409, 'Not following this store');
		case LogicErrorCode.CannotRemoveLastManager:
			return new APIException(400, 'Cannot remove the last manager from store');

		case LogicErrorCode.InsufficientFunds:
			return new APIException(400, 'Insufficient funds');
		case LogicErrorCode.NoAccountDetails:
			return new APIException(400, 'No account details provided');
		case LogicErrorCode.StoreContextRequired:
			return new APIException(400, 'Only a store can carry out this action');

		case LogicErrorCode.OrderInvalidStatusTransition:
			return new APIException(400, 'Order invalid status transition');
		case LogicErrorCode.OrderNotPayable:
			return new APIException(400, 'Order is not in payment pending state');

		case LogicErrorCode.ProductNotFound:
			return new APIException(404, 'Product not found');
		case LogicErrorCode.ProductStoreMismatch:
			return new APIException(
				403,
				'Unauthorized: Cannot act on products from a different store'
			);
		case LogicErrorCode.ProductInvalidRating:
			return new APIException(400, 'Product rating must be between 1 and 5');
		case LogicErrorCode.ProductStoreNotFound:
			return new APIException(404, 'Store not found');

		case LogicErrorCode.PaymentFailed:
			return new APIException(402, 'Payment failed');

		case LogicErrorCode.Unexpected:
		default:
			return new APIException(500, 'Internal server error');
	}
};
