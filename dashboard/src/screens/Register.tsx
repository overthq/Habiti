import React from 'react';
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	TouchableOpacity
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import authStyles from '../styles/auth';
import Button from '../components/global/Button';
import { AppStackParamList } from '../types/navigation';
import { useRegisterMutation } from '../types/api';

const Register: React.FC = () => {
	const [name, setName] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const [email, setEmail] = React.useState('');
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, register] = useRegisterMutation();

	const goToAuth = () => {
		navigate('Authenticate');
	};

	const handleSubmit = async () => {
		try {
			await register({ input: { name, email, phone } });
			navigate('Verify', { phone });
		} catch (error) {
			console.log(error);
		}
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
				<Text style={authStyles.inputLabel}>Email</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
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
			<Button text='Register' onPress={handleSubmit} loading={fetching} />
			<TouchableOpacity onPress={goToAuth} style={{ marginTop: 8 }}>
				<Text style={{ fontSize: 16 }}>Already have an account? Log in.</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};

export default Register;
