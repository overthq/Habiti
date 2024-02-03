import React from 'react';
import {
	View,
	TextInput,
	KeyboardAvoidingView,
	TouchableOpacity
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import authStyles from '../styles/auth';
import Button from '../components/global/Button';
import { AppStackParamList } from '../types/navigation';
import { useRegisterMutation } from '../types/api';
import Typography from '../components/global/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';

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
		<SafeAreaView>
			<KeyboardAvoidingView style={authStyles.container}>
				<Typography style={authStyles.title}>{`Let's meet you.`}</Typography>
				<Typography
					style={authStyles.description}
				>{`This helps us in personalizing your experience.`}</Typography>
				<View>
					<Typography style={authStyles.inputLabel}>Name</Typography>
					<TextInput
						value={name}
						onChangeText={setName}
						style={authStyles.input}
					/>
				</View>
				<View>
					<Typography style={authStyles.inputLabel}>Email</Typography>
					<TextInput
						value={email}
						onChangeText={setEmail}
						style={authStyles.input}
					/>
				</View>
				<View>
					<Typography style={authStyles.inputLabel}>Phone</Typography>
					<TextInput
						value={phone}
						onChangeText={setPhone}
						style={authStyles.input}
					/>
				</View>
				<Button text='Register' onPress={handleSubmit} loading={fetching} />
				<TouchableOpacity onPress={goToAuth} style={{ marginTop: 8 }}>
					<Typography>Already have an account? Log in.</Typography>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Register;
