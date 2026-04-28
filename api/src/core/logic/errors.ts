import { HTTPException } from 'hono/http-exception';

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
	PayoutFailed = 'PayoutFailed',

	PaymentFailed = 'PaymentFailed',

	Unexpected = 'Unexpected',

	CartEmpty = 'CartEmpty',
	InsufficientStock = 'InsufficientStock',
	ProductInsufficientStock = 'ProductInsufficientStock'
}

export const logicErrorToApiException = (
	error: LogicErrorCode
): HTTPException => {
	switch (error) {
		case LogicErrorCode.NotAuthenticated:
			return new HTTPException(401, { message: 'Authentication required' });
		case LogicErrorCode.Forbidden:
			return new HTTPException(403, { message: 'Forbidden' });

		case LogicErrorCode.CannotManageStore:
			return new HTTPException(403, {
				message: 'Unauthorized: Cannot manage store'
			});

		case LogicErrorCode.UserNotFound:
			return new HTTPException(404, { message: 'User not found' });
		case LogicErrorCode.StoreNotFound:
			return new HTTPException(404, { message: 'Store not found' });
		case LogicErrorCode.OrderNotFound:
			return new HTTPException(404, { message: 'Order not found' });
		case LogicErrorCode.CardNotFound:
			return new HTTPException(404, { message: 'Card not found' });
		case LogicErrorCode.AdminNotFound:
			return new HTTPException(404, { message: 'Admin not found' });
		case LogicErrorCode.NotFound:
			return new HTTPException(404, { message: 'Not found' });

		case LogicErrorCode.InvalidCredentials:
			return new HTTPException(401, { message: 'Invalid credentials' });
		case LogicErrorCode.InvalidToken:
			return new HTTPException(401, { message: 'Invalid token' });
		case LogicErrorCode.TokenExpired:
			return new HTTPException(401, { message: 'Token expired' });
		case LogicErrorCode.TokenReused:
			return new HTTPException(401, { message: 'Token reused' });

		case LogicErrorCode.InvalidInput:
		case LogicErrorCode.ValidationFailed:
			return new HTTPException(400, { message: 'Invalid request' });

		case LogicErrorCode.InvalidQuantity:
			return new HTTPException(400, {
				message: 'Quantity must be greater than 0'
			});
		case LogicErrorCode.NegativeQuantity:
			return new HTTPException(400, { message: 'Quantity cannot be negative' });

		case LogicErrorCode.AlreadyFollowing:
			return new HTTPException(409, {
				message: 'Already following this store'
			});
		case LogicErrorCode.NotFollowing:
			return new HTTPException(409, { message: 'Not following this store' });
		case LogicErrorCode.CannotRemoveLastManager:
			return new HTTPException(400, {
				message: 'Cannot remove the last manager from store'
			});

		case LogicErrorCode.InsufficientFunds:
			return new HTTPException(400, { message: 'Insufficient funds' });
		case LogicErrorCode.NoAccountDetails:
			return new HTTPException(400, { message: 'No account details provided' });
		case LogicErrorCode.StoreContextRequired:
			return new HTTPException(400, {
				message: 'Only a store can carry out this action'
			});

		case LogicErrorCode.OrderInvalidStatusTransition:
			return new HTTPException(400, {
				message: 'Order invalid status transition'
			});
		case LogicErrorCode.OrderNotPayable:
			return new HTTPException(400, {
				message: 'Order is not in payment pending state'
			});

		case LogicErrorCode.ProductNotFound:
			return new HTTPException(404, { message: 'Product not found' });
		case LogicErrorCode.ProductStoreMismatch:
			return new HTTPException(403, {
				message: 'Unauthorized: Cannot act on products from a different store'
			});
		case LogicErrorCode.ProductInvalidRating:
			return new HTTPException(400, {
				message: 'Product rating must be between 1 and 5'
			});
		case LogicErrorCode.ProductStoreNotFound:
			return new HTTPException(404, { message: 'Store not found' });
		case LogicErrorCode.ProductInsufficientStock:
			return new HTTPException(409, {
				message: 'Insufficient stock for one or more products'
			});
		case LogicErrorCode.InsufficientStock:
			return new HTTPException(409, { message: 'Insufficient stock' });

		case LogicErrorCode.PayoutInsufficientFunds:
			return new HTTPException(400, {
				message: 'Insufficient funds for requested payout'
			});
		case LogicErrorCode.PayoutFailed:
			return new HTTPException(500, { message: 'Payout failed' });

		case LogicErrorCode.PaymentFailed:
			return new HTTPException(402, { message: 'Payment failed' });

		case LogicErrorCode.Unexpected:
		default:
			return new HTTPException(500, { message: 'Internal server error' });
	}
};
