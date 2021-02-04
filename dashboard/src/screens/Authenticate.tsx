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

const Authenticate: React.FC = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation();

	const handleSubmit = async () => {
		await authenticate(phone);
		navigate('Verify', { phone });
	};

	return (
		<View style={styles.container}>
			<Text>Authenticate</Text>
			<TextInput value={phone} onChangeText={setPhone} />
			<TouchableOpacity onPress={handleSubmit}>
				<Text>Next</Text>
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
