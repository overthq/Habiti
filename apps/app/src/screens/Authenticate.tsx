import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthenticateMutation } from '../hooks/mutations';

interface AuthenticateFormValues {
	email: string;
	password: string;
}

const Authenticate = () => {
	const authenticateMutation = useAuthenticateMutation();
	const { control, handleSubmit } = useForm<AuthenticateFormValues>({
		defaultValues: { email: '', password: '' }
	});
	const { goBack } = useNavigation();

	const onSubmit = (values: AuthenticateFormValues) => {
		console.log(values);
		authenticateMutation.mutate({
			email: values.email,
			password: values.password
		});
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
				<Typography variant='secondary'>Log in to your account.</Typography>

				<Spacer y={16} />

				<FormInput
					name='email'
					control={control}
					label='Email address'
					placeholder='john@habiti.app'
					keyboardType='email-address'
					autoCorrect={false}
					autoCapitalize='none'
				/>

				<Spacer y={8} />

				<FormInput
					name='password'
					control={control}
					label='Password'
					placeholder='Your password'
					secureTextEntry
					autoCapitalize='none'
					autoCorrect={false}
				/>

				<Spacer y={16} />

				<Button
					text='Submit'
					onPress={handleSubmit(onSubmit)}
					loading={authenticateMutation.isPending}
				/>
			</SafeAreaView>
		</Screen>
	);
};

export default Authenticate;
