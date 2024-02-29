import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import Button from '../components/global/Button';
import authStyles from '../styles/auth';
import useStore from '../state';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import CodeInput from '../components/verify/CodeInput';

const Verify: React.FC = () => {
	const [code, setCode] = React.useState('');
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const logIn = useStore(state => state.logIn);
	const [{ fetching }, verify] = useVerifyMutation();

	const { phone } = params;

	const handleSubmit = async () => {
		try {
			const { data } = await verify({ input: { phone, code } });

			if (data?.verify) {
				const { userId, accessToken } = data.verify;
				logIn(userId, accessToken);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Screen style={authStyles.container}>
			<Typography style={authStyles.title}>Your verification code</Typography>
			<Typography style={authStyles.description}>
				A verification code was sent to your phone via SMS.
			</Typography>
			<TextInput
				autoFocus
				style={styles.hidden}
				onChangeText={setCode}
				keyboardType='number-pad'
			/>
			<View style={styles.inputs}>
				{Array(6)
					.fill(0)
					.map((_, index) => (
						<CodeInput key={index} value={code[index]} />
					))}
			</View>
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
		marginBottom: 16
	},
	hidden: {
		height: 1,
		width: 1,
		opacity: 0
	}
});

export default Verify;
