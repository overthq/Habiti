import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';

const Verify = () => {
	const [code, setCode] = React.useState(new Array(5).fill(undefined));

	const handleFieldChange = (value: string, index: number) => {
		const newCode = [...code];
		newCode[index] = Number(value);
		setCode(newCode);
	};

	const handleSubmit = () => {
		console.log(code.join('').toString());
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputs}>
				{code.map((value, index) => (
					<TextInput
						key={index}
						style={styles.input}
						value={value}
						onChangeText={val => handleFieldChange(val, index)}
					/>
				))}
			</View>
			<TouchableOpacity onPress={handleSubmit}>
				<Text></Text>
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
