import z from 'zod';

export const eventIdSchema = z.union([z.number(), z.string()]).optional();

export const TransferSuccessSchema = z.object({
	id: eventIdSchema,
	reference: z.string(),
	reason: z.string().optional().nullable()
});

export const TransferFailureSchema = z.object({
	id: eventIdSchema,
	reference: z.string(),
	reason: z.string().optional().nullable()
});

export const TransferReversedSchema = z.object({
	id: eventIdSchema,
	reference: z.string()
});

export type TransferSuccessPayload = z.infer<typeof TransferSuccessSchema>;
export type TransferFailurePayload = z.infer<typeof TransferFailureSchema>;
export type TransferReversedPayload = z.infer<typeof TransferReversedSchema>;

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
	id: eventIdSchema,
	customer: z.object({ email: z.string() }), // I don't know if this is actually supplied.
	authorization: CardAuthorizationSchema,
	metadata: CardChargeMetadataSchema.nullable()
});

export const TransferChargeSuccessSchema = z.object({
	id: eventIdSchema,
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

const jsonText = z.string().transform((value, ctx) => {
	try {
		return JSON.parse(value) as unknown;
	} catch {
		ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' });
		return z.NEVER;
	}
});

const orderMetadata = z.object({
	orderId: z.string().trim().min(1).optional()
});

/** Object, a JSON string, or a JSON string of that string. Anything else is dropped. */
const metadataSchema = z
	.union([
		orderMetadata,
		jsonText.pipe(orderMetadata),
		jsonText.pipe(jsonText).pipe(orderMetadata)
	])
	.nullable()
	.catch(null);

const presentString = z.string().trim().min(1).nullable().catch(null);

const amountSchema = z
	.union([
		z.number().int().nonnegative(),
		z.string().regex(/^\d+$/).transform(Number)
	])
	.nullable()
	.catch(null);

const customerSchema = z
	.object({ email: z.string().optional() })
	.nullable()
	.catch(null);

const authorizationSchema = z
	.object({
		authorization_code: z.string().optional(),
		bin: z.string().optional(),
		last4: z.string().optional(),
		exp_month: z.string().optional(),
		exp_year: z.string().optional(),
		card_type: z.string().optional(),
		bank: z.string().optional(),
		channel: presentString.optional(),
		signature: z.string().optional(),
		country_code: z.string().optional()
	})
	.nullable()
	.catch(null);

export const ChargeEventSchema = z.preprocess(
	value =>
		value && typeof value === 'object' && !Array.isArray(value) ? value : {},
	z
		.object({
			amount: amountSchema.optional(),
			currency: presentString.optional(),
			reference: presentString.optional(),
			channel: presentString.optional(),
			gateway_response: presentString.optional(),
			message: presentString.optional(),
			reason: presentString.optional(),
			metadata: metadataSchema.optional(),
			customer: customerSchema.optional(),
			authorization: authorizationSchema.optional()
		})
		.transform(data => {
			const channel = data.authorization?.channel ?? data.channel ?? null;
			const cardType = data.authorization?.card_type;
			const instrument =
				channel === 'dedicated_nuban'
					? 'dedicated_account'
					: cardType === 'transfer' || channel === 'bank_transfer'
						? 'transfer'
						: 'card';
			const authorization = data.authorization;

			return {
				orderId: data.metadata?.orderId ?? null,
				amount: data.amount ?? null,
				currency: data.currency ?? null,
				reference: data.reference ?? null,
				reason: data.gateway_response ?? data.message ?? data.reason ?? null,
				instrument,
				card:
					instrument === 'card'
						? {
								email: data.customer?.email ?? '',
								signature: authorization?.signature ?? '',
								authorizationCode: authorization?.authorization_code ?? '',
								bin: authorization?.bin ?? '',
								last4: authorization?.last4 ?? '',
								expMonth: authorization?.exp_month ?? '',
								expYear: authorization?.exp_year ?? '',
								bank: authorization?.bank ?? '',
								cardType: cardType ?? '',
								countryCode: authorization?.country_code ?? ''
							}
						: null
			};
		})
);

export type ChargeEvent = z.infer<typeof ChargeEventSchema>;
