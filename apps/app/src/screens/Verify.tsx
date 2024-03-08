import { Button, Input, Screen, Typography } from '@market/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';

import useStore from '../state';
import styles from '../styles/auth';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const VerifyAuthentication: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const logIn = useStore(state => state.logIn);
	const [code, setCode] = React.useState('');
	const { phone } = params;
	const [{ fetching }, verify] = useVerifyMutation();

	const handleSubmit = async () => {
		if (phone && code) {
			const { data } = await verify({ input: { phone, code } });
			if (data?.verify) {
				const { accessToken, userId } = data.verify;
				logIn(userId, accessToken);
			}
		}
		// Show some validation error.
	};

	return (
		<Screen>
			<Typography size='xxxlarge' weight='bold'>
				Enter your verification code
			</Typography>
			<Typography>
				A verification code was sent to your phone via SMS.
			</Typography>
			<Input onChangeText={setCode} keyboardType='number-pad' />
			<Button text='Verify Code' onPress={handleSubmit} loading={fetching} />
		</Screen>
	);
};

export default VerifyAuthentication;
