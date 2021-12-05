import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { authenticate } from '../utils/auth';
import styles from '../styles/auth';
import { AppStackParamList } from '../types/navigation';

const Authenticate: React.FC = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleSubmit = async () => {
		await authenticate(phone);
		navigate('Verify', { phone });
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter your phone number.</Text>
			<Text style={styles.description}>
				{`We'll send your verification code here.`}
			</Text>
			<View>
				<Text style={styles.inputLabel}>Phone number</Text>
				<TextInput
					style={styles.input}
					placeholder='08012345678'
					value={phone}
					onChangeText={setPhone}
					keyboardType='number-pad'
				/>
			</View>
			<TouchableOpacity style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>Next</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Authenticate;
