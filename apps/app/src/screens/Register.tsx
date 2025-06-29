import {
	Button,
	FormInput,
	Spacer,
	Typography,
	Screen
} from '@habiti/components';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRegisterMutation } from '../hooks/mutations';

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	pushToken?: string;
}

const Register = () => {
	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			pushToken: undefined
		}
	});
	const registerMutation = useRegisterMutation();

	const onSubmit = (values: RegisterFormValues) => {
		registerMutation.mutate({
			name: values.name,
			email: values.email,
			password: values.password
		});
	};

	return (
		<Screen style={{ padding: 16 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<FormProvider {...methods}>
					<Spacer y={32} />
					<Typography weight='bold' size='xxxlarge'>
						Create your account
					</Typography>
					<Typography variant='secondary'>Let's get you started.</Typography>
					<Spacer y={16} />
					<FormInput
						name='name'
						control={methods.control}
						label='Name'
						placeholder='John Doe'
						autoCorrect={false}
					/>
					<Spacer y={8} />
					<FormInput
						name='email'
						control={methods.control}
						label='Email address'
						placeholder='john.appleseed@gmail.com'
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
					<Spacer y={8} />
					<FormInput
						name='confirmPassword'
						control={methods.control}
						label='Confirm password'
						placeholder='Confirm password'
						secureTextEntry
						autoCapitalize='none'
					/>
					<Spacer y={16} />
					<Button
						loading={registerMutation.isPending}
						text='Create account'
						onPress={methods.handleSubmit(onSubmit)}
					/>
				</FormProvider>
			</SafeAreaView>
		</Screen>
	);
};

export default Register;
