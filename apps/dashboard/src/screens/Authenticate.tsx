import React from 'react';
import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useAuthenticateMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';

const authenticateSchema = z.object({
	email: z.string().email('Invalid email address')
});

type AuthenticateFormValues = z.infer<typeof authenticateSchema>;

const Authenticate: React.FC<AppStackScreenProps<'Authenticate'>> = ({
	navigation
}) => {
	const methods = useForm<AuthenticateFormValues>({
		resolver: zodResolver(authenticateSchema),
		defaultValues: { email: '' }
	});

	const authenticateMutation = useAuthenticateMutation();

	const onSubmit = (values: AuthenticateFormValues) => {
		authenticateMutation.mutate({
			email: values.email
		});
	};

	return (
		<Screen>
			<SafeAreaView style={{ flex: 1 }}>
				<Pressable onPress={navigation.goBack}>
					<Icon name='chevron-left' />
				</Pressable>
				<Spacer y={8} />
				<Typography weight='bold' size='xxxlarge'>
					Welcome back.
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					Enter your email to receive a verification code.
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
				<Spacer y={16} />
				<Button
					loading={authenticateMutation.isPending}
					text='Send verification code'
					onPress={methods.handleSubmit(onSubmit)}
					disabled={!methods.formState.isValid}
				/>
				<Spacer y={8} />
			</SafeAreaView>
		</Screen>
	);
};

export default Authenticate;
