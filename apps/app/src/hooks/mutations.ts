import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';

import useStore from '../state';
import { AppStackParamList } from '../navigation/types';
import { performLogout, refreshAuthTokens } from '../utils/refreshManager';
import env from '../../env';

interface AuthTokensResponse {
	accessToken: string;
	refreshToken: string;
	userId: string;
}

const upgradeHeaders = async (
	accessToken: string | null
): Promise<Record<string, string>> => {
	let token: string | null = null;

	if (accessToken) {
		try {
			// Access token may have expired, attempt refresh first.
			token = (await refreshAuthTokens()).accessToken;
		} catch {
			// Guest session is unrecoverable (revoked/expired refresh token).
			// Send no Authorization header — a stale token would be rejected
			// outright, while an unauthenticated sign-in still succeeds.
		}
	}

	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
};

interface RegisterArgs {
	email: string;
	name: string;
}

export const useRegisterMutation = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return useMutation({
		mutationFn: async (input: RegisterArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/register`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		},
		onSuccess: (_, variables) => {
			navigate('Verify', { email: variables.email });
		}
	});
};

interface AuthenticateArgs {
	email: string;
}

export const useAuthenticateMutation = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return useMutation({
		mutationFn: async (input: AuthenticateArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/login`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		},
		onSuccess: (_, variables) => {
			navigate('Verify', { email: variables.email });
		}
	});
};

interface VerifyCodeArgs {
	email: string;
	code: string;
}

export const useVerifyCodeMutation = () => {
	const queryClient = useQueryClient();
	const { logIn, accessToken } = useStore(
		useShallow(state => ({
			logIn: state.logIn,
			accessToken: state.accessToken
		}))
	);

	return useMutation({
		mutationFn: async (input: VerifyCodeArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/verify-code`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: await upgradeHeaders(accessToken)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message ?? 'Verification failed');
			}

			return data as AuthTokensResponse;
		},
		onSuccess: async data => {
			logIn(data.accessToken);
			await SecureStore.setItemAsync('refreshToken', data.refreshToken);
			await queryClient.invalidateQueries();
		}
	});
};

export const useAppleSignInMutation = () => {
	const queryClient = useQueryClient();
	const { logIn, accessToken } = useStore(
		useShallow(state => ({
			logIn: state.logIn,
			accessToken: state.accessToken
		}))
	);

	return useMutation({
		mutationFn: async () => {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL
				]
			});

			if (!credential.identityToken) {
				throw new Error('Apple sign-in failed');
			}

			const fullName = [
				credential.fullName?.givenName,
				credential.fullName?.familyName
			]
				.filter(Boolean)
				.join(' ');

			const response = await fetch(`${env.apiUrl}/auth/apple`, {
				method: 'POST',
				body: JSON.stringify({
					identityToken: credential.identityToken,
					...(fullName ? { fullName } : {})
				}),
				headers: await upgradeHeaders(accessToken)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message ?? 'Apple sign-in failed');
			}

			return data as AuthTokensResponse;
		},
		onSuccess: async data => {
			logIn(data.accessToken);
			await SecureStore.setItemAsync('refreshToken', data.refreshToken);
			await queryClient.invalidateQueries();
		}
	});
};

export const useLogoutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: performLogout,
		onSettled: () => {
			queryClient.removeQueries({
				predicate: query => query.queryKey[0] !== 'auth'
			});
		}
	});
};
