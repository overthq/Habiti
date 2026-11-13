import env from './env';

const APPLE_SDK_URL =
	'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

interface AppleSignInResponse {
	authorization: { code: string; id_token: string; state?: string };
	user?: { email?: string; name?: { firstName?: string; lastName?: string } };
}

declare global {
	interface Window {
		AppleID?: {
			auth: {
				init: (config: {
					clientId: string;
					scope: string;
					redirectURI: string;
					state: string;
					nonce: string;
					usePopup: boolean;
				}) => void;
				signIn: () => Promise<AppleSignInResponse>;
			};
		};
	}
}

export const isAppleSignInEnabled = () => Boolean(env.appleClientId);

let sdkPromise: Promise<void> | null = null;

const loadAppleSdk = () => {
	if (window.AppleID) return Promise.resolve();

	if (!sdkPromise) {
		sdkPromise = new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = APPLE_SDK_URL;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => {
				sdkPromise = null;
				script.remove();
				reject(new Error('Could not load Sign in with Apple'));
			};
			document.head.appendChild(script);
		});
	}

	return sdkPromise;
};

const toHex = (bytes: Uint8Array) =>
	Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

const randomHex = () => toHex(crypto.getRandomValues(new Uint8Array(32)));

export interface PreparedAppleSignIn {
	nonce: string;
	hashedNonce: string;
	state: string;
}

/**
 * Everything async happens here, ahead of the click. Safari only allows the
 * popup when it opens directly from the user's tap, so `signInWithApple`
 * must not await anything before calling `AppleID.auth.signIn()`.
 */
export const prepareAppleSignIn = async (): Promise<PreparedAppleSignIn> => {
	await loadAppleSdk();

	const nonce = randomHex();
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(nonce)
	);
	return {
		nonce,
		hashedNonce: toHex(new Uint8Array(digest)),
		state: randomHex()
	};
};

export class AppleSignInCancelled extends Error {}

export const signInWithApple = async (prepared: PreparedAppleSignIn) => {
	if (!env.appleClientId || !window.AppleID) {
		throw new Error('Sign in with Apple is not available');
	}

	window.AppleID.auth.init({
		clientId: env.appleClientId,
		scope: 'name email',
		redirectURI: env.appleRedirectUri || window.location.origin,
		state: prepared.state,
		nonce: prepared.hashedNonce,
		usePopup: true
	});

	let response: AppleSignInResponse;

	try {
		response = await window.AppleID.auth.signIn();
	} catch (error) {
		const code = (error as { error?: string } | undefined)?.error;

		if (
			code === 'popup_closed_by_user' ||
			code === 'user_cancelled_authorize'
		) {
			throw new AppleSignInCancelled();
		}

		throw new Error('Sign in with Apple failed');
	}

	if (response.authorization.state !== prepared.state) {
		throw new Error('Sign in with Apple failed');
	}

	// Apple only shares the name the first time someone authorizes the app.
	const fullName = [
		response.user?.name?.firstName,
		response.user?.name?.lastName
	]
		.filter(Boolean)
		.join(' ');

	return {
		identityToken: response.authorization.id_token,
		nonce: prepared.nonce,
		...(fullName ? { fullName } : {})
	};
};
