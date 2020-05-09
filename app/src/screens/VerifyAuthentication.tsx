import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import { useVerifyAuthenticationMutation } from '../types';
import styles from '../styles/auth';

const VerifyAuthentication = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation();
	const { saveAccessToken } = React.useContext(UserContext);
	const [code, setCode] = React.useState('');
	const [
		{ data, fetching },
		verifyAuthentication
	] = useVerifyAuthenticationMutation();
	const { phone } = params as { phone: string };

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
