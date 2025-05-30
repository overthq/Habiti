import { Button, Screen, Spacer, Typography } from '@habiti/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import CodeInput from '../components/verify/CodeInput';
import useStore from '../state';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import { useShallow } from 'zustand/react/shallow';

const Verify: React.FC = () => {
	const [code, setCode] = React.useState('');
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const { logIn } = useStore(
		useShallow(state => ({
			logIn: state.logIn
		}))
	);
	const [{ fetching }, verify] = useVerifyMutation();
	const { email } = params;

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
		<Screen>
			<Typography weight='bold' size='xxxlarge'>
				Your verification code
			</Typography>
			<Typography variant='secondary'>
				A verification code was sent to your email. Enter it below to verify.
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
			<Button onPress={handleSubmit} text='Verify' loading={fetching} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
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

export default Verify;
