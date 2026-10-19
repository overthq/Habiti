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

const CardAuthorizationSchema = z.object({
	authorization_code: z.string(),
	signature: z.string(),
	bin: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	card_type: z.string(),
	bank: z.string(),
	country_code: z.string()
});

// Covers `charge.success` and `bank.transfer.rejected`. Paystack echoes the
// metadata we send as an object or a JSON string, and sometimes sends `""`
// or `0` instead.
export const ChargeEventSchema = z
	.object({
		amount: z.number().int().optional(),
		currency: z.string().optional(),
		reference: z.string().optional(),
		gateway_response: z.string().nullish(),
		metadata: z.unknown(),
		customer: z.object({ email: z.string() }).nullish(),
		authorization: z.object({ card_type: z.string() }).passthrough().nullish()
	})
	.transform(
		({ metadata, customer, authorization, gateway_response, ...charge }) => {
			let parsed = metadata;
			if (typeof parsed === 'string') {
				try {
					parsed = JSON.parse(parsed);
				} catch {
					parsed = undefined;
				}
			}
			const orderId = (parsed as { orderId?: unknown } | null | undefined)
				?.orderId;

			const card =
				authorization?.card_type !== 'transfer'
					? CardAuthorizationSchema.safeParse(authorization).data
					: undefined;

			return {
				...charge,
				orderId: typeof orderId === 'string' && orderId ? orderId : undefined,
				reason: gateway_response ?? undefined,
				card:
					card && customer
						? {
								email: customer.email,
								signature: card.signature,
								authorizationCode: card.authorization_code,
								bin: card.bin,
								last4: card.last4,
								expMonth: card.exp_month,
								expYear: card.exp_year,
								bank: card.bank,
								cardType: card.card_type,
								countryCode: card.country_code
							}
						: undefined
			};
		}
	);

export type ChargeEvent = z.infer<typeof ChargeEventSchema>;
