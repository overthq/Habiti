import { Button, FormInput, Typography, Spacer } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
	Keyboard,
	KeyboardAvoidingView,
	Pressable,
	TouchableWithoutFeedback
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

import authStyles from '../styles/auth';
import { useRegisterMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
}

const Register: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, register] = useRegisterMutation();
	const formMethods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});

	const goToAuth = () => {
		navigate('Authenticate');
	};

	const onSubmit = async (values: RegisterFormValues) => {
		try {
			const { error } = await register({ input: values });
			if (error) {
				console.log(error);
			} else {
				navigate('Authenticate');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<FormProvider {...formMethods}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				{/* <SafeAreaView> */}
				<KeyboardAvoidingView style={authStyles.container} behavior='padding'>
					<Typography
						size='xxxlarge'
						weight='bold'
					>{`Let's meet you.`}</Typography>
					<Spacer y={2} />
					<Typography variant='secondary'>
						This helps us in personalizing your experience.
					</Typography>
					<Spacer y={16} />
					<FormInput
						name='name'
						label='Name'
						placeholder='John Doe'
						control={formMethods.control}
					/>
					<Spacer y={8} />
					<FormInput
						name='email'
						label='Email address'
						placeholder='john.doe@gmail.com'
						control={formMethods.control}
					/>
					<Spacer y={8} />
					<FormInput
						name='password'
						label='Password'
						placeholder='Password'
						control={formMethods.control}
					/>
					<Spacer y={8} />
					<Button
						text='Register'
						onPress={formMethods.handleSubmit(onSubmit)}
						loading={fetching}
					/>
					<Pressable
						onPress={goToAuth}
						style={{ alignSelf: 'center', marginTop: 8 }}
					>
						<Typography>Already have an account? Log in.</Typography>
					</Pressable>
				</KeyboardAvoidingView>
				{/* </SafeAreaView> */}
			</TouchableWithoutFeedback>
		</FormProvider>
	);
};

export default Register;
