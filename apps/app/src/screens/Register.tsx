import { Button, FormInput, Spacer, Typography } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
	KeyboardAvoidingView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';

import styles from '../styles/auth';
import { useRegisterMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
}

const Register = () => {
	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	});

	const { navigate } =
		useNavigation<StackNavigationProp<AppStackParamList, 'Authenticate'>>();
	const [{ fetching }, register] = useRegisterMutation();

	const onSubmit = async (values: RegisterFormValues) => {
		const { error, data } = await register({
			input: values
		});

		if (error) {
			console.log(error);
		} else if (data?.register) {
			navigate('Authenticate');
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView style={styles.container} behavior='padding'>
				<Typography
					size='xxxlarge'
					weight='bold'
				>{`Let's meet you.`}</Typography>
				<Spacer y={2} />
				<Typography>This helps us in personalizing your experience.</Typography>
				<Spacer y={16} />
				<FormInput
					name='name'
					control={methods.control}
					label='Name'
					placeholder='John Doe'
					autoCorrect={false}
					autoCapitalize='words'
				/>
				<Spacer y={8} />
				<FormInput
					name='email'
					control={methods.control}
					label='Email'
					placeholder='john@johndoe.io'
					autoCorrect={false}
					autoCapitalize='none'
					keyboardType='email-address'
				/>
				<Spacer y={8} />
				<FormInput
					name='password'
					control={methods.control}
					label='Password'
					placeholder='Your password'
					secureTextEntry
				/>
				<Spacer y={16} />
				<Button
					text='Next'
					onPress={methods.handleSubmit(onSubmit)}
					loading={fetching}
				/>
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
					onPress={() => navigate('Authenticate')}
				>
					<Typography weight='medium'>Already have an account?</Typography>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default Register;
