import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useVerifyAuthenticationMutation } from '../types';
import styles from '../styles/auth';
import useAccessToken from '../hooks/useAccessToken';
import { AuthStackParamList } from '../../App';

const VerifyAuthentication = () => {
	const { params } = useRoute<
		RouteProp<AuthStackParamList, 'VerifyAuthentication'>
	>();
	const { navigate } = useNavigation();
	const { saveAccessToken } = useAccessToken();
	const [code, setCode] = React.useState('');
	const [
		{ data, fetching },
		verifyAuthentication
	] = useVerifyAuthenticationMutation();
	const { phone } = params;

	React.useEffect(() => {
		if (data?.verifyAuthentication) {
			saveAccessToken(data.verifyAuthentication);
			navigate('Main');
		}
	}, [data]);

	const handleSubmit = () => {
		if (phone && code) {
			verifyAuthentication({ phone, code });
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter your verification code</Text>
			<Text style={styles.description}>
				A verification code was sent to your phone via SMS.
			</Text>
			<TextInput style={styles.input} onChangeText={setCode} />
			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				{fetching ? (
					<ActivityIndicator />
				) : (
					<Text style={styles.buttonText}>Verify Code</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default VerifyAuthentication;
