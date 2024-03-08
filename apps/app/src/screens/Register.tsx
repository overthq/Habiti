import { Button, Input, Typography } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
	KeyboardAvoidingView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';

import styles from '../styles/auth';
import { useRegisterMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

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
				<Typography
					size='xxxlarge'
					weight='bold'
				>{`Let's meet you.`}</Typography>
				<Typography>This helps us in personalizing your experience.</Typography>
				<Input
					label='Name'
					onChangeText={setName}
					placeholder='John Doe'
					autoCorrect={false}
					autoCapitalize='words'
				/>
				<Input
					label='Email'
					onChangeText={setEmail}
					placeholder='john@johndoe.io'
					autoCorrect={false}
					autoCapitalize='none'
					keyboardType='email-address'
				/>
				<Input
					label='Phone'
					onChangeText={setPhone}
					placeholder='08012345678'
					keyboardType='phone-pad'
					autoCorrect={false}
					autoCapitalize='none'
				/>
				<Button text='Next' onPress={handleSubmit} loading={fetching} />
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
					onPress={() => navigate('Authenticate')}
				>
					<Typography weight='medium'>Already have an account?</Typography>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default Register;
