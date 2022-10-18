import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';

const { width } = Dimensions.get('window');

const Brand: React.FC = () => {
	const { control } = useFormContext();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your brand</Text>
			<Text style={styles.description}>
				Please enter the name of your store.
			</Text>
			<View>
				<Text style={styles.label}>Store name</Text>
				<Controller
					name='name'
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							value={value}
							style={styles.input}
							placeholder='Nike'
							onChangeText={onChange}
							onBlur={onBlur}
						/>
					)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width,
		padding: 16
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
	description: {
		fontSize: 16
	},
	label: {
		fontSize: 16,
		fontWeight: '500',
		marginTop: 8,
		marginBottom: 4
	},
	input: {
		borderRadius: 4,
		height: 40,
		fontSize: 16,
		paddingLeft: 8,
		backgroundColor: '#DFDFDF'
	}
});

export default Brand;
