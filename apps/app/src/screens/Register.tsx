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
import { z } from 'zod';

import { useRegisterMutation } from '../hooks/mutations';

const registerFormSchema = z.object({
	name: z.string().min(1),
	email: z.string().email()
});

const Register = () => {
	const methods = useForm<z.infer<typeof registerFormSchema>>({
		defaultValues: {
			name: '',
			email: ''
		}
	});
	const registerMutation = useRegisterMutation();

	const onSubmit = (values: z.infer<typeof registerFormSchema>) => {
		registerMutation.mutate({
			name: values.name,
			email: values.email
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
					<Typography variant='secondary'>
						Enter your details to receive a verification code.
					</Typography>
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
					<Spacer y={16} />
					<Button
						disabled={!methods.formState.isValid}
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
