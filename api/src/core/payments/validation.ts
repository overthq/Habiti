import z from 'zod';

export const TransferSuccessSchema = z.object({
	reference: z.string(),
	reason: z.string().optional().nullable()
});

export const TransferFailureSchema = z.object({
	reference: z.string(),
	reason: z.string().optional().nullable()
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

export const CardChargeMetadataSchema = z.union([
	z.object({
		userId: z.string().optional().nullable(),
		orderId: z.string().optional().nullable()
	}),
	z.string()
]);

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

// {
//   "event": "transfer.success",
//   "data": {
//     "amount": 30000,
//     "currency": "NGN",
//     "domain": "test",
//     "failures": null,
//     "id": 37272792,
//     "integration": {
//       "id": 463433,
//       "is_live": true,
//       "business_name": "Boom Boom Industries NG"
//     },
//     "reason": "Have fun...",
//     "reference": "1jhbs3ozmen0k7y5efmw",
//     "source": "balance",
//     "source_details": null,
//     "status": "success",
//     "titan_code": null,
//     "transfer_code": "TRF_wpl1dem4967avzm",
//     "transferred_at": null,
//     "recipient": {
//       "active": true,
//       "currency": "NGN",
//       "description": "",
//       "domain": "test",
//       "email": null,
//       "id": 8690817,
//       "integration": 463433,
//       "metadata": null,
//       "name": "Jack Sparrow",
//       "recipient_code": "RCP_a8wkxiychzdzfgs",
//       "type": "nuban",
//       "is_deleted": false,
//       "details": {
//         "account_number": "0000000000",
//         "account_name": null,
//         "bank_code": "011",
//         "bank_name": "First Bank of Nigeria"
//       },
//       "created_at": "2020-09-03T12:11:25.000Z",
//       "updated_at": "2020-09-03T12:11:25.000Z"
//     },
//     "session": {
//       "provider": null,
//       "id": null
//     },
//     "created_at": "2020-10-26T12:28:57.000Z",
//     "updated_at": "2020-10-26T12:28:57.000Z"
//   }
// }

// {
//   "event": "transfer.failed",
//   "data": {
//     "amount": 200000,
//     "currency": "NGN",
//     "domain": "test",
//     "failures": null,
//     "id": 69123462,
//     "integration": {
//       "id": 100043,
//       "is_live": true,
//       "business_name": "Paystack"
//     },
//     "reason": "Enjoy",
//     "reference": "1976435206",
//     "source": "balance",
//     "source_details": null,
//     "status": "failed",
//     "titan_code": null,
//     "transfer_code": "TRF_chs98y5rykjb47w",
//     "transferred_at": null,
//     "recipient": {
//       "active": true,
//       "currency": "NGN",
//       "description": null,
//       "domain": "test",
//       "email": "test@email.com",
//       "id": 13584206,
//       "integration": 100043,
//       "metadata": null,
//       "name": "Ted Lasso",
//       "recipient_code": "RCP_cjcua8itre45gs",
//       "type": "nuban",
//       "is_deleted": false,
//       "details": {
//         "authorization_code": null,
//         "account_number": "0123456789",
//         "account_name": "Ted Lasso",
//         "bank_code": "011",
//         "bank_name": "First Bank of Nigeria"
//       },
//       "created_at": "2021-04-12T15:30:14.000Z",
//       "updated_at": "2021-04-12T15:30:14.000Z"
//     },
//     "session": {
//       "provider": "nip",
//       "id": "74849400998877667"
//     },
//     "created_at": "2021-04-12T15:30:15.000Z",
//     "updated_at": "2021-04-12T15:41:21.000Z"
//   }
// }
