import {
	Button,
	FormInput,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';

import useStore from '../state';
import { useAuthenticateMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface AuthenticateFormValues {
	email: string;
	password: string;
}

const Authenticate: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const methods = useForm<AuthenticateFormValues>({
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const logIn = useStore(({ logIn }) => logIn);
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const backToRegister = () => {
		navigate('Register');
	};

	const onSubmit = async (values: AuthenticateFormValues) => {
		const { error, data } = await authenticate({ input: values });

		if (error) {
			console.log(error);
		} else if (data?.authenticate) {
			logIn(data.authenticate.userId, data.authenticate.accessToken);
		}
		// navigate('Verify', { phone });
	};

	return (
		<Screen style={{ padding: 16, paddingTop: 32 }}>
			<SafeAreaView>
				<Typography weight='bold' size='xxxlarge'>
					Welcome back.
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					Log back in with your details.
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
				<Spacer y={8} />
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
				<Spacer y={8} />
				<TextButton
					weight='medium'
					style={{ alignSelf: 'center' }}
					onPress={backToRegister}
				>
					Don't have an account yet?
				</TextButton>
			</SafeAreaView>
		</Screen>
	);
};

export default Authenticate;
