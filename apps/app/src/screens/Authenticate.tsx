import {
	Button,
	FormInput,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import useStore from '../state';
import styles from '../styles/auth';
import { useAuthenticateMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface AuthenticateFormValues {
	email: string;
	password: string;
}

const Authenticate = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const logIn = useStore(state => state.logIn);
	const [{ fetching }, authenticate] = useAuthenticateMutation();
	const { control, handleSubmit } = useForm<AuthenticateFormValues>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = async (values: AuthenticateFormValues) => {
		const { error, data } = await authenticate({ input: values });

		if (error) {
			console.log({ error });
		} else if (data?.authenticate) {
			const { accessToken, userId } = data.authenticate;
			logIn(userId, accessToken);
		}
	};

	const goToRegister = () => navigate('Register');

	return (
		<Screen style={styles.container}>
			<KeyboardAvoidingView style={{ width: '100%' }} behavior='padding'>
				<Typography weight='bold' size='xxxlarge'>
					Welcome back
				</Typography>
				<Typography variant='secondary'>{`We'll send your verification code here.`}</Typography>

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
				/>

				<Spacer y={16} />

				<Button
					text='Submit'
					onPress={handleSubmit(onSubmit)}
					loading={fetching}
				/>

				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
					onPress={goToRegister}
				>
					<Typography weight='medium'>{`Don't have an account?`}</Typography>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</Screen>
	);
};

export default Authenticate;
