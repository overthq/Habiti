import { useMutation } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import * as SecureStore from 'expo-secure-store';

import useStore from '../state';
import { AppStackParamList } from '../types/navigation';
import env from '../../env';

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
	const logIn = useStore(useShallow(state => state.logIn));

	return useMutation({
		mutationFn: async (input: VerifyCodeArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/verify-code`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		},
		onSuccess: async data => {
			logIn(data.accessToken);
			await SecureStore.setItemAsync('refreshToken', data.refreshToken);
		}
	});
};
