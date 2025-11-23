import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import * as SecureStore from 'expo-secure-store';

import useStore from '../state';
import env from '../../env';

interface RegisterArgs {
	email: string;
	name: string;
	password: string;
}

export const useRegisterMutation = () => {
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
		}
	});
};

interface AuthenticateArgs {
	email: string;
	password: string;
}

export const useAuthenticateMutation = () => {
	const logIn = useStore(useShallow(state => state.logIn));

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
		onSuccess: async data => {
			logIn(data.userId, data.accessToken);
			await SecureStore.setItemAsync('refreshToken', data.refreshToken);
		}
	});
};
