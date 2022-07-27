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
import { StackNavigationProp } from '@react-navigation/stack';
import styles from '../styles/auth';
import Button from '../components/global/Button';
import { AppStackParamList } from '../types/navigation';
import { useRegisterMutation } from '../types/api';

const Register = () => {
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [phone, setPhone] = React.useState('');

	const { navigate } =
		useNavigation<StackNavigationProp<AppStackParamList, 'Authenticate'>>();
	const [{ fetching }, register] = useRegisterMutation();

	const handleSubmit = async () => {
		try {
			await register({ input: { name, phone, email } });
			navigate('Verify', { phone });
		} catch (error) {
			console.log(error);
		}
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
					<Text style={styles.inputLabel}>Email</Text>
					<TextInput
						style={styles.input}
						onChangeText={setEmail}
						placeholder='john@johndoe.io'
						autoCorrect={false}
						autoCapitalize='none'
						keyboardType='email-address'
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
				<Button text='Next' onPress={handleSubmit} loading={fetching} />
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
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
