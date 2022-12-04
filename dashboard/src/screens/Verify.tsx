import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Button from '../components/global/Button';
import authStyles from '../styles/auth';
import useStore from '../state';
import { useVerifyMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Verify: React.FC = () => {
	const [code, setCode] = React.useState<string[]>([]);
	const { params } = useRoute<RouteProp<AppStackParamList, 'Verify'>>();
	const logIn = useStore(state => state.logIn);
	const [{ fetching }, verify] = useVerifyMutation();

	const { phone } = params;

	const codeRef = React.useRef<(TextInput | null)[]>([]);
	const codeThing = new Array(6).fill(0);

	const handleKeyPress = (key: string, index: number) => {
		if (key === 'Backspace' && index !== 0 && codeRef.current) {
			codeRef.current[index - 1]?.focus();
		}
	};

	const handleFieldChange = (value: string, index: number) => {
		if (codeRef.current) {
			if (index < 5 && value) {
				codeRef.current[index + 1]?.focus();
			}

			if (index === codeRef.current.length - 1) {
				codeRef.current[index]?.blur();
			}

			const newCode = [...code];
			newCode[index] = value;
			setCode(newCode);
		}
	};

	const handleSubmit = async () => {
		try {
			const { data } = await verify({
				input: { phone, code: code.join('') }
			});

			if (data?.verify) {
				const { userId, accessToken } = data.verify;
				logIn(userId, accessToken);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={authStyles.container}>
			<Text style={authStyles.title}>Your verification code</Text>
			<Text style={authStyles.description}>
				A verification code was sent to your phone via SMS.
			</Text>
			<View style={styles.inputs}>
				{codeThing.map((_, index) => (
					<TextInput
						key={index}
						ref={el => codeRef.current?.push(el)}
						style={styles.input}
						keyboardType='numeric'
						onChangeText={val => handleFieldChange(val, index)}
						onKeyPress={e => handleKeyPress(e.nativeEvent.key, index)}
						caretHidden
					/>
				))}
			</View>
			<Button onPress={handleSubmit} text='Verify' loading={fetching} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20
	},
	inputs: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10
	},
	input: {
		height: 50,
		width: 50,
		borderRadius: 8,
		borderWidth: 2,
		fontSize: 17,
		textAlign: 'center',
		borderColor: '#D3D3D3'
	}
});

export default Verify;
