import { Button, Input, Screen, Spacer, Typography } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

import styles from '../styles/auth';
import { useAuthenticateMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Authenticate: React.FC = () => {
	const [phone, setPhone] = React.useState('');
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ fetching }, authenticate] = useAuthenticateMutation();

	const handleSubmit = async () => {
		try {
			await authenticate({ input: { phone } });
			navigate('Verify', { phone });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		// <SafeAreaView>
		<Screen style={styles.container}>
			<Typography weight='bold' size='xxxlarge'>
				Enter your phone number.
			</Typography>
			<Typography variant='secondary'>{`We'll send your verification code here.`}</Typography>
			<Spacer y={16} />
			<Input
				label='Phone number'
				placeholder='08012345678'
				value={phone}
				onChangeText={setPhone}
				keyboardType='number-pad'
			/>
			<Spacer y={16} />
			<Button loading={fetching} text='Next' onPress={handleSubmit} />
		</Screen>
		// </SafeAreaView>
	);
};

export default Authenticate;
