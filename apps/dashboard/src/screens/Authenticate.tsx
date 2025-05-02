import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import useStore from '../state';
import { useAuthenticateMutation } from '../types/api';
import { useShallow } from 'zustand/react/shallow';

const authenticateSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long')
});

type AuthenticateFormValues = z.infer<typeof authenticateSchema>;

const Authenticate: React.FC = () => {
	const { goBack } = useNavigation();

	const methods = useForm<AuthenticateFormValues>({
		defaultValues: { email: '', password: '' },
		resolver: zodResolver(authenticateSchema)
	});

	const logIn = useStore(useShallow(({ logIn }) => logIn));
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const onSubmit = async (values: AuthenticateFormValues) => {
		const { error, data } = await authenticate({ input: values });

		if (error) {
			console.log(error);
		} else if (data?.authenticate) {
			logIn(data.authenticate.userId, data.authenticate.accessToken);
		}
	};

	return (
		<Screen style={{ padding: 16 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Pressable onPress={goBack}>
					<Icon name='chevron-left' />
				</Pressable>
				<Spacer y={8} />
				<Typography weight='bold' size='xxxlarge'>
					Welcome back.
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					Log back in with your details.
				</Typography>
				<Spacer y={16} />
				<FormInput
					name='email'
					control={methods.control}
					label='Email address'
					placeholder='john.doe@gmail.com'
					keyboardType='email-address'
					autoCapitalize='none'
					autoCorrect={false}
				/>
				<Spacer y={8} />
				<FormInput
					name='password'
					control={methods.control}
					label='Password'
					placeholder='Password'
					secureTextEntry
					autoCapitalize='none'
				/>
				<Spacer y={16} />
				<Button
					loading={fetching}
					text='Next'
					onPress={methods.handleSubmit(onSubmit)}
					disabled={!methods.formState.isValid}
				/>
				<Spacer y={8} />
			</SafeAreaView>
		</Screen>
	);
};

export default Authenticate;
