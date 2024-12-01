import {
	Button,
	FormInput,
	Icon,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useStore from '../state';
import { useAuthenticateMutation } from '../types/api';

interface AuthenticateFormValues {
	email: string;
	password: string;
}

const Authenticate = () => {
	const logIn = useStore(state => state.logIn);
	const [{ fetching }, authenticate] = useAuthenticateMutation();
	const { control, handleSubmit } = useForm<AuthenticateFormValues>({
		defaultValues: { email: '', password: '' }
	});
	const { goBack } = useNavigation();

	const onSubmit = async (values: AuthenticateFormValues) => {
		const { error, data } = await authenticate({ input: values });

		if (error) {
			console.log({ error });
		} else if (data?.authenticate) {
			const { accessToken, userId } = data.authenticate;
			logIn(userId, accessToken);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Screen style={{ padding: 16 }}>
				<Pressable onPress={goBack}>
					<Icon name='chevron-left' />
				</Pressable>

				<Spacer y={8} />

				<Typography weight='bold' size='xxxlarge'>
					Welcome back.
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
					autoCapitalize='none'
					autoCorrect={false}
				/>

				<Spacer y={16} />

				<Button
					text='Submit'
					onPress={handleSubmit(onSubmit)}
					loading={fetching}
				/>
			</Screen>
		</SafeAreaView>
	);
};

export default Authenticate;
