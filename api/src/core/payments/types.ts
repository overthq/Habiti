export interface ChargeAuthorizationOptions {
	authorizationCode: string;
	email: string;
	amount: string;
}

export interface InitialChargeOptions {
	email: string;
	amount: number;
	orderId: string | undefined;
}

export interface PayAccountOptions {
	amount: string;
	reference: string;
	recipient: string;
	metadata?: {
		payoutId?: string;
	};
}

export interface VerifyTransferOptions {
	transferId: string;
}

export interface FinalizeTransferOptions {
	transferCode: string;
	otp: string;
}

export interface ResolveAccountNumberOptions {
	accountNumber: string;
	bankCode: string;
}

export interface CreateTransferReceipientOptions {
	name: string;
	accountNumber: string;
	bankCode: string;
}
