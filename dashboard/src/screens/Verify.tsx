import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';

// In the future: use a third party solution with SMS support
const Verify: React.FC = () => {
	const [code, setCode] = React.useState(new Array(5).fill(undefined));

	const codeRef = React.useRef<(TextInput | null)[]>();

	const handleKeyPress = (key: string, index: number) => {
		if (key === 'Backspace' && index !== 0) {
			codeRef.current && codeRef.current[index - 1]?.focus();
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
			newCode[index] = Number(value);
			setCode(newCode);
		}
	};

	const handleSubmit = () => {
		console.log(code.join('').toString());
	};

	return (
		<View style={styles.container}>
			<Text>Your verification code</Text>
			<View style={styles.inputs}>
				{code.map((value, index) => (
					<TextInput
						key={index}
						ref={el => codeRef.current?.push(el)}
						style={styles.input}
						value={value}
						onChangeText={val => handleFieldChange(val, index)}
						onKeyPress={e => handleKeyPress(e.nativeEvent.key, index)}
					/>
				))}
			</View>
			<TouchableOpacity onPress={handleSubmit}>
				<Text>Verify</Text>
			</TouchableOpacity>
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
		justifyContent: 'space-between'
	},
	input: {
		height: 50,
		width: 50,
		borderRadius: 8,
		backgroundColor: '#505050'
	}
});

export default Verify;
