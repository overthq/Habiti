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
import styles from '../styles/auth';
import { authenticate } from '../utils/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

const Authenticate = () => {
	const [loading, setLoading] = React.useState(false);
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation<
		StackNavigationProp<AuthStackParamList, 'Authenticate'>
	>();

	const handleSubmit = async () => {
		setLoading(true);
		await authenticate(phone);
		setLoading(false);
		navigate('Verify', { phone });
	};

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
						keyboardType='number-pad'
						style={styles.input}
						value={phone}
						onChangeText={setPhone}
					/>
				</View>
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					{loading ? (
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
