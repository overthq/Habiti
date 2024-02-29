import { Button, Screen } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView
} from 'react-native';

import styles from '../styles/auth';
import { useAuthenticateMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Authenticate = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } =
		useNavigation<StackNavigationProp<AppStackParamList, 'Authenticate'>>();
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const handleSubmit = async () => {
		try {
			const { data, error } = await authenticate({ input: { phone } });
			navigate('Verify', { phone });
			console.log({ data, error });
		} catch (error) {
			// FIXME: Handle errors better here.
			// (For some reason, the errors do not propagate here.)
			console.log(error);
		}
	};

	const goToRegister = () => navigate('Register');

	return (
		<Screen style={styles.container}>
			<KeyboardAvoidingView style={{ width: '100%' }} behavior='padding'>
				<Text style={styles.title}>Enter your phone number.</Text>
				<Text
					style={styles.description}
				>{`We'll send your verification code here.`}</Text>
				<View>
					<Text style={styles.inputLabel}>Phone</Text>
					<TextInput
						placeholder='08012345678'
						keyboardType='number-pad'
						style={styles.input}
						value={phone}
						onChangeText={setPhone}
					/>
				</View>
				<Button
					text='Send verification code'
					onPress={handleSubmit}
					loading={fetching}
				/>
				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
					onPress={goToRegister}
				>
					<Text
						style={{ fontWeight: '500', fontSize: 15 }}
					>{`Don't have an account?`}</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</Screen>
	);
};

export default Authenticate;
