import {
	Button,
	FormInput,
	Screen,
	Spacer,
	Typography
} from '@market/components';
import React from 'react';
import { useForm } from 'react-hook-form';

import useStore from '../state';
import styles from '../styles/auth';
import { useAuthenticateMutation } from '../types/api';

interface AuthenticateFormValues {
	email: string;
	password: string;
}

const Authenticate: React.FC = () => {
	const methods = useForm<AuthenticateFormValues>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const logIn = useStore(({ logIn }) => logIn);
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const onSubmit = async (values: AuthenticateFormValues) => {
		try {
			const { error, data } = await authenticate({ input: values });

			if (error) {
				console.log(error);
			} else if (data?.authenticate) {
				logIn(data.authenticate.userId, data.authenticate.accessToken);
			}
			// navigate('Verify', { phone });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		// <SafeAreaView>
		<Screen style={styles.container}>
			<Typography weight='bold' size='xxxlarge'>
				Enter your phone number.
			</Typography>
			<Typography variant='secondary'>{`We'll send your verification code here.`}</Typography>
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
			<FormInput
				name='password'
				control={methods.control}
				label='Password'
				placeholder='Password'
				secureTextEntry
			/>
			<Spacer y={16} />
			<Button
				loading={fetching}
				text='Next'
				onPress={methods.handleSubmit(onSubmit)}
			/>
		</Screen>
		// </SafeAreaView>
	);
};

export default Authenticate;
