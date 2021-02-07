import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authenticate } from '../utils/auth';
import authStyles from '../styles/auth';

const Authenticate: React.FC = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation();

	const handleSubmit = async () => {
		await authenticate(phone);
		navigate('Verify', { phone });
	};

	return (
		<View style={authStyles.container}>
			<Text>Authenticate</Text>
			<View>
				<Text style={authStyles.title}>Phone number</Text>
				<TextInput
					style={authStyles.input}
					placeholder='08012345678'
					value={phone}
					onChangeText={setPhone}
				/>
			</View>
			<TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
				<Text style={authStyles.buttonText}>Next</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Authenticate;
