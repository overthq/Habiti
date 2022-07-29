import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styles from '../styles/auth';
import { AppStackParamList } from '../types/navigation';
import { useAuthenticateMutation } from '../types/api';
import Button from '../components/global/Button';

const Authenticate: React.FC = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const handleSubmit = async () => {
		try {
			await authenticate({ input: { phone } });
			navigate('Verify', { phone });
		} catch (error) {
			console.log(error);
		}
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
			<Button loading={fetching} text='Next' onPress={handleSubmit} />
		</View>
	);
};

export default Authenticate;
