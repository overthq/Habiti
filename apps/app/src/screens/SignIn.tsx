import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Button,
	FormInput,
	Screen,
	Separator,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AppleSignInButton from '../components/AppleSignInButton';
import { useAuthenticateMutation } from '../hooks/mutations';
import { useAppleSignInAvailable } from '../hooks/useAuth';
import type { AuthStackScreenProps } from '../navigation/types';

const signInSchema = z.object({
	email: z.string().email()
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC<AuthStackScreenProps<'Auth.Main'>> = ({
	navigation
}) => {
	const authenticateMutation = useAuthenticateMutation();
	const appleAvailable = useAppleSignInAvailable();

	const { control, handleSubmit, formState } = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: '' },
		mode: 'onChange'
	});

	const onSubmit = (values: SignInFormValues) => {
		authenticateMutation.mutate({ email: values.email });
	};

	return (
		<Screen>
			<Spacer y={16} />

			<Typography weight='bold' size='xxxlarge'>
				Sign in
			</Typography>

			<Spacer y={24} />

			<FormInput
				name='email'
				control={control}
				label='Email address'
				placeholder='john@habiti.app'
				keyboardType='email-address'
				autoCorrect={false}
				autoCapitalize='none'
				returnKeyType='go'
				onSubmitEditing={handleSubmit(onSubmit)}
			/>

			<Spacer y={16} />

			<Button
				text='Send verification code'
				onPress={handleSubmit(onSubmit)}
				loading={authenticateMutation.isPending}
				disabled={!formState.isValid}
			/>

			{appleAvailable && (
				<>
					<Spacer y={16} />

					<OrDivider />

					<Spacer y={16} />

					<AppleSignInButton />
				</>
			)}

			<Spacer y={16} />

			<TextButton
				weight='medium'
				style={{ alignSelf: 'center' }}
				onPress={() => navigation.navigate('Auth.Register')}
			>
				New here? Create an account.
			</TextButton>
		</Screen>
	);
};

const OrDivider: React.FC = () => (
	<View style={styles.divider}>
		<Separator style={styles.dividerLine} />

		<Typography size='small' variant='secondary'>
			OR
		</Typography>

		<Separator style={styles.dividerLine} />
	</View>
);

const styles = StyleSheet.create({
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	dividerLine: {
		flex: 1
	}
});

export default SignIn;
