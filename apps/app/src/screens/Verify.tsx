import { Button, Screen, Spacer, Typography } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import CodeInput from '../components/verify/CodeInput';
import useStore from '../state';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const VerifyAuthentication: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const logIn = useStore(state => state.logIn);
	const [code, setCode] = React.useState('');
	const { email } = params;
	const [{ fetching }, verify] = useVerifyMutation();

	const handleSubmit = async () => {
		if (email && code) {
			const { data, error } = await verify({ input: { email, code } });

			if (data?.verify) {
				const { accessToken, userId } = data.verify;
				logIn(userId, accessToken);
			} else if (error) {
				console.log(error);
			}
		}
	};

	return (
		<Screen style={{ justifyContent: 'center', paddingHorizontal: 16 }}>
			<Typography size='xxxlarge' weight='bold'>
				Enter verification code
			</Typography>
			<Typography variant='secondary'>
				A verification code was sent to your phone via SMS.
			</Typography>
			<TextInput
				autoFocus
				style={styles.hidden}
				onChangeText={setCode}
				keyboardType='number-pad'
			/>
			<Spacer y={16} />
			<View style={styles.inputs}>
				{Array(6)
					.fill(0)
					.map((_, index) => (
						<CodeInput key={index} value={code[index]} />
					))}
			</View>
			<Spacer y={32} />
			<Button text='Verify' onPress={handleSubmit} loading={fetching} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	inputs: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16
	},
	hidden: {
		height: 1,
		width: 1,
		opacity: 0
	}
});

export default VerifyAuthentication;
