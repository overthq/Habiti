'use client';

export const openPaystackPopup = async (accessCode: string) => {
	// @ts-ignore
	const Paystack = (await import('@paystack/inline-js')).default;
	const popup = new Paystack();

	popup.resumeTransaction(accessCode);
};
