import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { verifyCode } from '../utils/auth';
import { login } from '../redux/auth/actions';
import Button from '../components/global/Button';
import authStyles from '../styles/auth';

// In the future: use a third party solution with SMS support
const Verify: React.FC = () => {
	const [code, setCode] = React.useState<string[]>([]);
	const [loading, setLoading] = React.useState(false);
	const { params } = useRoute<any>();
	const dispatch = useDispatch();

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
			setLoading(true);
			const { accessToken, userId } = await verifyCode({
				phone,
				code: code.join('')
			});
			dispatch(login(accessToken, userId));
			setLoading(false);
			// Also fetch managed stores, and dispatch an action to set them BEFORE navigating to the main screen.
			// It would be wise to use a loading indicator while this is happening, however, awaits do not work on the dispatch function for some reason.
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
					/>
				))}
			</View>
			{/* <TouchableOpacity onPress={handleSubmit} style={authStyles.button}>
				<Text style={authStyles.buttonText}>Verify</Text>
			</TouchableOpacity> */}
			<Button onPress={handleSubmit} text='Verify' loading={loading} />
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
