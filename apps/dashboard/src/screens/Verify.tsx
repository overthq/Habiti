import { Button, Screen, Spacer, Typography } from '@habiti/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import CodeInput from '../components/verify/CodeInput';
import { useVerifyCodeMutation } from '../data/mutations';
import { AppStackParamList } from '../types/navigation';

const Verify: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const [code, setCode] = React.useState('');
	const verifyCodeMutation = useVerifyCodeMutation();

	const handleSubmit = () => {
		verifyCodeMutation.mutate({
			email: params.email,
			code
		});
	};

	return (
		<Screen style={{ justifyContent: 'center', paddingHorizontal: 16 }}>
			<Typography size='xxxlarge' weight='bold'>
				Enter verification code
			</Typography>
			<Typography variant='secondary'>
				A verification code was sent to your email.
			</Typography>
			<TextInput
				autoFocus
				style={styles.hidden}
				onChangeText={setCode}
				keyboardType='number-pad'
				maxLength={6}
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
			<Button
				text='Verify'
				onPress={handleSubmit}
				loading={verifyCodeMutation.isPending}
			/>
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

export default Verify;
