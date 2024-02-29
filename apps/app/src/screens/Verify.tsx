import { Button } from '@market/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, TextInput } from 'react-native';

import useStore from '../state';
import styles from '../styles/auth';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const VerifyAuthentication: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const logIn = useStore(state => state.logIn);
	const [code, setCode] = React.useState('');
	const { phone } = params;
	const [{ fetching }, verify] = useVerifyMutation();

	const handleSubmit = async () => {
		if (phone && code) {
			const { data } = await verify({ input: { phone, code } });
			if (data?.verify) {
				const { accessToken, userId } = data.verify;
				logIn(userId, accessToken);
			}
		}
		// Show some validation error.
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter your verification code</Text>
			<Text style={styles.description}>
				A verification code was sent to your phone via SMS.
			</Text>
			<TextInput
				style={styles.input}
				onChangeText={setCode}
				keyboardType='number-pad'
			/>
			<Button text='Verify Code' onPress={handleSubmit} loading={fetching} />
		</View>
	);
};

export default VerifyAuthentication;
