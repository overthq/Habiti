import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

const Brand = () => {
	const { handleChange, handleBlur } = useFormikContext<{
		name: string;
		shortName: string;
	}>();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your brand</Text>
			<Text>Please enter the name of your store.</Text>
			<View>
				<Text>Store name</Text>
				<TextInput
					style={styles.input}
					placeholder='Nike'
					onChangeText={handleChange('name')}
					onBlur={handleBlur('name')}
				/>
			</View>
			<View>
				<Text>Short name (used in URL)</Text>
				<TextInput
					style={styles.input}
					placeholder='nike'
					onChangeText={handleChange('shortName')}
					onBlur={handleBlur('shortName')}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
	input: {
		paddingLeft: 8,
		backgroundColor: '#DFDFDF'
	}
});

export default Brand;
