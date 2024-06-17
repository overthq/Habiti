import {
	Button,
	Screen,
	Spacer,
	TextButton,
	Typography
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

import { AppStackParamList } from '../types/navigation';

const Landing = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<Screen style={{ padding: 16, justifyContent: 'center' }}>
			<Typography size='xxxlarge' weight='bold' style={{ textAlign: 'center' }}>
				Welcome to Habiti
			</Typography>
			<Spacer y={16} />
			<Button text='Sign up' onPress={() => navigate('Register')} />
			<Spacer y={8} />
			<TextButton
				weight='medium'
				style={{ alignSelf: 'center' }}
				onPress={() => navigate('Authenticate')}
			>
				Log In
			</TextButton>
		</Screen>
	);
};

export default Landing;
