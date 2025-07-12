import z from 'zod';

export const TransferSuccessSchema = z.object({
	reference: z.string()
});

export const TransferFailureSchema = z.object({
	reference: z.string()
});

export type TransferSuccessPayload = z.infer<typeof TransferSuccessSchema>;
export type TransferFailurePayload = z.infer<typeof TransferFailureSchema>;

export const CardAuthorizationSchema = z.object({
	authorization_code: z.string(),
	card_type: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	bin: z.string(),
	bank: z.string(),
	channel: z.string(),
	signature: z.string(),
	reusable: z.boolean(),
	country_code: z.string(),
	account_name: z.string().nullable()
});

export const TransferAuthorizationSchema = z.object({
	authorization_code: z.string(),
	bin: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	card_type: z.literal('transfer'),
	bank: z.string(),
	country_code: z.string(),
	brand: z.string(),
	reusable: z.boolean(),
	sender_bank: z.string(),
	sender_bank_account_number: z.string(),
	sender_country: z.string(),
	sender_name: z.string(),
	narration: z.string(),
	receiver_bank_account_number: z.string(),
	receiver_bank: z.string()
});

export const CardChargeMetadataSchema = z.object({
	userId: z.string().optional().nullable(),
	orderId: z.string().optional().nullable()
});

export const CardChargeSuccessSchema = z.object({
	customer: z.object({ email: z.string() }), // I don't know if this is actually supplied.
	authorization: CardAuthorizationSchema,
	metadata: CardChargeMetadataSchema
});

export const TransferChargeSuccessSchema = z.object({
	authorization: TransferAuthorizationSchema,
	metadata: CardChargeMetadataSchema
});

export type CardChargeSuccessPayload = z.infer<typeof CardChargeSuccessSchema>;
export type TransferChargeSuccessPayload = z.infer<
	typeof TransferChargeSuccessSchema
>;

export type ChargeSuccessPayload =
	| CardChargeSuccessPayload
	| TransferChargeSuccessPayload;

export const isTransferCharge = (
	data: ChargeSuccessPayload
): data is TransferChargeSuccessPayload => {
	return data.authorization.card_type === 'transfer';
};
