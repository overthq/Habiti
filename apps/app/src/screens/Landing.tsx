import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const Landing = () => {
	const { navigate } = useNavigation();

	return (
		<Screen style={{ padding: 16, justifyContent: 'center' }}>
			<Typography size='xxxlarge'>Welcome to Market</Typography>
			<Spacer y={16} />
			<Button text='Sign up' onPress={() => navigate('Register')} />
			<Spacer y={8} />
			<TextButton
				style={{ alignSelf: 'center' }}
				onPress={() => navigate('Authenticate')}
			>
				Log In
			</TextButton>
		</Screen>
	);
};

export default Landing;
