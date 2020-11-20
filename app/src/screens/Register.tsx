import React from 'react';
import {
	View,
	TextInput,
	Text,
	KeyboardAvoidingView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/auth';
import { register } from '../utils/auth';

const Register = () => {
	const [name, setName] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation();

	const handleSubmit = async () => {
		await register({ name, phone });
		navigate('VerifyAuthentication', { phone });
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView style={styles.container} behavior='padding'>
				<Text style={styles.title}>{`Let's meet you.`}</Text>
				<Text
					style={styles.description}
				>{`This helps us in personalizing your experience.`}</Text>
				<View>
					<Text style={styles.inputLabel}>Name</Text>
					<TextInput
						style={styles.input}
						onChangeText={setName}
						placeholder='John Doe'
						autoCorrect={false}
						autoCapitalize='words'
					/>
				</View>
				<View>
					<Text style={styles.inputLabel}>Phone</Text>
					<TextInput
						style={styles.input}
						onChangeText={setPhone}
						placeholder='08012345678'
						autoCorrect={false}
						autoCapitalize='none'
						keyboardType='phone-pad'
					/>
				</View>
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Next</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 10 }}
					onPress={() => navigate('Authenticate')}
				>
					<Text
						style={{ fontWeight: '500', fontSize: 15 }}
					>{`Already have an account?`}</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default Register;
