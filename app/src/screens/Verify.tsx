import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styles from '../styles/auth';
import { AppStackParamList } from '../types/navigation';
import { verifyCode } from '../utils/auth';
import { login } from '../redux/auth/actions';

const VerifyAuthentication: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const { navigate } = useNavigation();
	const dispatch = useDispatch();
	const [loading, setLoading] = React.useState(false);
	const [code, setCode] = React.useState('');
	const { phone } = params;

	const handleSubmit = async () => {
		if (phone && code) {
			setLoading(true);
			const { accessToken, userId } = await verifyCode({ phone, code });
			setLoading(false);
			dispatch(login(accessToken, userId));
			navigate('Home');
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
			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				{loading ? (
					<ActivityIndicator />
				) : (
					<Text style={styles.buttonText}>Verify Code</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default VerifyAuthentication;
