import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthenticateMutation } from '../hooks/mutations';
import type { AppStackScreenProps } from '../navigation/types';

interface AuthenticateFormValues {
	email: string;
}

const Authenticate: React.FC<AppStackScreenProps<'Authenticate'>> = ({
	navigation
}) => {
	const authenticateMutation = useAuthenticateMutation();
	const { control, handleSubmit } = useForm<AuthenticateFormValues>({
		defaultValues: { email: '' }
	});

	const onSubmit = (values: AuthenticateFormValues) => {
		authenticateMutation.mutate({
			email: values.email
		});
	};

	return (
		<Screen style={{ padding: 16 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Pressable onPress={navigation.goBack}>
					<Icon name='chevron-left' />
				</Pressable>

				<Spacer y={8} />

				<Typography weight='bold' size='xxxlarge'>
					Welcome back.
				</Typography>
				<Typography variant='secondary'>
					Enter your email to receive a verification code.
				</Typography>

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

				<Spacer y={16} />

				<Button
					text='Send verification code'
					onPress={handleSubmit(onSubmit)}
					loading={authenticateMutation.isPending}
				/>

				<Spacer y={16} />

				<TextButton
					weight='medium'
					style={{ alignSelf: 'center' }}
					onPress={() => navigation.navigate('Register')}
				>
					New here? Create an account.
				</TextButton>
			</SafeAreaView>
		</Screen>
	);
};

export default Authenticate;
