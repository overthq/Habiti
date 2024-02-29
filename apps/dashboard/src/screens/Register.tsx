import { Button, FormInput, Typography } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import authStyles from '../styles/auth';
import { useRegisterMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface RegisterFormValues {
	name: string;
	phone: string;
	email: string;
}

const Register: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, register] = useRegisterMutation();
	const formMethods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			phone: '',
			email: ''
		}
	});

	const goToAuth = () => {
		navigate('Authenticate');
	};

	const onSubmit = async (values: RegisterFormValues) => {
		try {
			await register({ input: values });
			navigate('Verify', { phone: values.phone });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<FormProvider {...formMethods}>
			<SafeAreaView>
				<KeyboardAvoidingView style={authStyles.container}>
					<Typography style={authStyles.title}>{`Let's meet you.`}</Typography>
					<Typography style={authStyles.description}>
						This helps us in personalizing your experience.
					</Typography>
					<FormInput
						name='name'
						placeholder='John Doe'
						control={formMethods.control}
					/>
					<FormInput
						name='email'
						placeholder='john.doe@gmail.com'
						control={formMethods.control}
					/>
					<FormInput
						name='phone'
						placeholder='08012345678'
						control={formMethods.control}
					/>
					<Button
						text='Register'
						onPress={formMethods.handleSubmit(onSubmit)}
						loading={fetching}
					/>
					<Pressable onPress={goToAuth} style={{ marginTop: 8 }}>
						<Typography>Already have an account? Log in.</Typography>
					</Pressable>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</FormProvider>
	);
};

export default Register;
