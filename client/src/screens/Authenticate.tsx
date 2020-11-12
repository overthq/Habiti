import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthenticateMutation } from '../types';
import styles from '../styles/auth';

const Authenticate = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation();

	const [{ data, fetching }, authenticate] = useAuthenticateMutation();

	React.useEffect(() => {
		console.log(data);
		if (data?.authenticate) {
			navigate('VerifyAuthentication', { phone });
		}
	}, [data]);

	const handleSubmit = () => authenticate({ phone });
	const goToRegister = () => navigate('Register');

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView style={{ width: '100%' }} behavior='padding'>
				<Text style={styles.title}>Enter your phone number.</Text>
				<Text
					style={styles.description}
				>{`We'll send your verification code here.`}</Text>
				<View>
					<Text style={styles.inputLabel}>Phone</Text>
					<TextInput
						placeholder='08012345678'
						style={styles.input}
						onChangeText={setPhone}
					/>
				</View>
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					{fetching ? (
						<ActivityIndicator />
					) : (
						<Text style={styles.buttonText}>Send verification code</Text>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 10 }}
					onPress={goToRegister}
				>
					<Text
						style={{ fontWeight: '500', fontSize: 15 }}
					>{`Don't have an account?`}</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</View>
	);
};

export default Authenticate;
