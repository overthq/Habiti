import { Screen, Typography } from '@market/components';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Brand: React.FC = () => {
	const { control } = useFormContext();

	return (
		<Screen style={styles.container}>
			<Typography weight='bold' size='xxxlarge'>
				Your brand
			</Typography>
			<Typography>Please enter the name of your store.</Typography>
			<View>
				<Typography weight='medium' style={styles.label}>
					Store name
				</Typography>
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
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		padding: 16
	},
	label: {
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
