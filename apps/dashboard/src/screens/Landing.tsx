import React from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
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

import AppleSignInButton, {
	useAppleSignInAvailable
} from '../components/AppleSignInButton';
import { useAuthenticateMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';
import { ACCOUNT_CREATION_ENABLED } from '../utils/constants';

const landingSchema = z.object({
	email: z.string().email('Invalid email address')
});

type LandingFormValues = z.infer<typeof landingSchema>;

const Landing: React.FC<AppStackScreenProps<'Landing'>> = ({ navigation }) => {
	const methods = useForm<LandingFormValues>({
		resolver: zodResolver(landingSchema),
		defaultValues: { email: '' },
		mode: 'onChange'
	});

	const authenticateMutation = useAuthenticateMutation();
	const appleAvailable = useAppleSignInAvailable();

	const onSubmit = (values: LandingFormValues) => {
		authenticateMutation.mutate({ email: values.email });
	};

	return (
		<Screen>
			<SafeAreaView style={styles.fill}>
				<KeyboardAvoidingView behavior='padding' style={styles.fill}>
					<Pressable
						style={styles.fill}
						onPress={Keyboard.dismiss}
						accessible={false}
					>
						<View style={styles.title}>
							<Typography
								size='xxxlarge'
								weight='bold'
								style={{ textAlign: 'center' }}
							>
								Habiti Dashboard
							</Typography>
						</View>
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
							text='Continue'
							onPress={methods.handleSubmit(onSubmit)}
							loading={authenticateMutation.isPending}
							disabled={!methods.formState.isValid}
						/>
						{appleAvailable && (
							<>
								<Spacer y={16} />
								<View style={styles.divider}>
									<Separator style={styles.fill} />
									<Typography size='small' variant='secondary'>
										OR
									</Typography>
									<Separator style={styles.fill} />
								</View>
								<Spacer y={16} />
								<AppleSignInButton />
							</>
						)}
						{ACCOUNT_CREATION_ENABLED && (
							<>
								<Spacer y={16} />
								<TextButton
									weight='medium'
									style={{ alignSelf: 'center' }}
									onPress={() => navigation.navigate('Register')}
								>
									Don't have an account? Create one.
								</TextButton>
							</>
						)}
						<Spacer y={24} />
					</Pressable>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Screen>
	);
};

const styles = StyleSheet.create({
	fill: {
		flex: 1
	},
	title: {
		flex: 1,
		justifyContent: 'center'
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	}
});

export default Landing;
