import { useMutation } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import useStore from '../state';
import { AppStackParamList } from '../types/navigation';
import env from '../../env';

interface RegisterArgs {
	email: string;
	name: string;
	password: string;
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
		onSuccess: () => {
			navigate('Authenticate');
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
		onSuccess: data => {
			logIn(data.userId, data.accessToken);
		}
	});
};
