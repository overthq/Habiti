import React from 'react';
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authStyles from '../styles/auth';
import { register } from '../utils/auth';
import Button from '../components/global/Button';

const Register: React.FC = () => {
	const [name, setName] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const { navigate } = useNavigation();

	const goToAuth = () => {
		navigate('Authenticate');
	};

	const handleSubmit = async () => {
		setLoading(true);
		await register({ name, phone });
		setLoading(false);
		navigate('Verify');
	};

	return (
		<KeyboardAvoidingView style={authStyles.container}>
			<Text style={authStyles.title}>{`Let's meet you.`}</Text>
			<Text
				style={authStyles.description}
			>{`This helps us in personalizing your experience.`}</Text>
			<View>
				<Text style={authStyles.inputLabel}>Name</Text>
				<TextInput
					value={name}
					onChangeText={setName}
					style={authStyles.input}
				/>
			</View>
			<View>
				<Text style={authStyles.inputLabel}>Phone</Text>
				<TextInput
					value={phone}
					onChangeText={setPhone}
					style={authStyles.input}
				/>
			</View>
			<TouchableOpacity onPress={handleSubmit} style={authStyles.button}>
				<Text style={authStyles.buttonText}>Register</Text>
			</TouchableOpacity>
			<Button text='Register' onPress={handleSubmit} loading={loading} />
			<TouchableOpacity onPress={goToAuth}>
				<Text>Already have an account? Log in.</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};

export default Register;
