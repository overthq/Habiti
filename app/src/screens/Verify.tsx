import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import styles from '../styles/auth';
import { AppStackParamList } from '../types/navigation';
import { verifyCode } from '../utils/auth';
import { login } from '../redux/auth/actions';
import Button from '../components/global/Button';
import { useAppDispatch } from '../redux/store';

const VerifyAuthentication: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = React.useState(false);
	const [code, setCode] = React.useState('');
	const { phone } = params;

	const handleSubmit = async () => {
		if (phone && code) {
			setLoading(true);
			const { accessToken, userId } = await verifyCode({ phone, code });
			setLoading(false);
			dispatch(login(accessToken, userId));
		}
		// Show some validation error.
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter your verification code</Text>
			<Text style={styles.description}>
				A verification code was sent to your phone via SMS.
			</Text>
			<TextInput style={styles.input} onChangeText={setCode} />
			<Button text='Verify Code' onPress={handleSubmit} loading={loading} />
		</View>
	);
};

export default VerifyAuthentication;
