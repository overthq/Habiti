import { Button, Input, Spacer, Typography } from '@habiti/components';
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
	const [password, setPassword] = React.useState('');

	const { navigate } =
		useNavigation<StackNavigationProp<AppStackParamList, 'Authenticate'>>();
	const [{ fetching }, register] = useRegisterMutation();

	const handleSubmit = async () => {
		const { error, data } = await register({
			input: { name, email, password }
		});

		if (error) {
			console.log(error);
		} else if (data?.register) {
			navigate('Authenticate');
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView style={styles.container} behavior='padding'>
				<Typography
					size='xxxlarge'
					weight='bold'
				>{`Let's meet you.`}</Typography>
				<Spacer y={2} />
				<Typography>This helps us in personalizing your experience.</Typography>
				<Spacer y={16} />
				<Input
					label='Name'
					onChangeText={setName}
					placeholder='John Doe'
					autoCorrect={false}
					autoCapitalize='words'
				/>
				<Spacer y={8} />
				<Input
					label='Email'
					onChangeText={setEmail}
					placeholder='john@johndoe.io'
					autoCorrect={false}
					autoCapitalize='none'
					keyboardType='email-address'
				/>
				<Spacer y={8} />
				<Input
					label='Password'
					onChangeText={setPassword}
					placeholder='Your password'
					secureTextEntry
				/>
				<Spacer y={16} />
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
