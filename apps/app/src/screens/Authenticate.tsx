import { Button, Input, Screen, Spacer, Typography } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView } from 'react-native';

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
				<Typography weight='bold' size='xxxlarge'>
					Welcome back
				</Typography>
				<Typography variant='secondary'>{`We'll send your verification code here.`}</Typography>

				<Spacer y={16} />
				<Input
					label='Phone'
					placeholder='08012345678'
					keyboardType='number-pad'
					value={phone}
					onChangeText={setPhone}
				/>

				<Spacer y={16} />

				<Button
					text='Send verification code'
					onPress={handleSubmit}
					loading={fetching}
				/>

				<TouchableOpacity
					style={{ alignSelf: 'center', marginTop: 8 }}
					onPress={goToRegister}
				>
					<Typography weight='medium'>{`Don't have an account?`}</Typography>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</Screen>
	);
};

export default Authenticate;
