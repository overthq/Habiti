import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Typography from '../global/Typography';

const { width } = Dimensions.get('window');

const Social = () => {
	const { control } = useFormContext();

	return (
		<View style={styles.container}>
			<Typography size='xxxlarge' weight='bold'>
				Social media
			</Typography>
			<Typography>
				Link your social accounts, so shoppers can follow you elsewhere.
			</Typography>
			<View>
				<Text style={styles.label}>Twitter username</Text>
				<Controller
					name='twitter'
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							value={value}
							style={styles.input}
							placeholder='@nike'
							onChangeText={onChange}
							onBlur={onBlur}
							autoCapitalize='none'
							autoCorrect={false}
						/>
					)}
				/>
			</View>
			<View>
				<Text style={styles.label}>Instagram username</Text>
				<Controller
					name='instagram'
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							value={value}
							style={styles.input}
							placeholder='@nike'
							onChangeText={onChange}
							onBlur={onBlur}
							autoCapitalize='none'
							autoCorrect={false}
						/>
					)}
				/>
			</View>
			<View>
				<Typography weight='medium' style={styles.label}>
					Website
				</Typography>
				<Controller
					name='website'
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							value={value}
							style={styles.input}
							placeholder='https://nike.com'
							onChangeText={onChange}
							onBlur={onBlur}
							keyboardType='url'
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
	label: {
		marginTop: 8,
		marginBottom: 4
	},
	input: {
		height: 40,
		borderRadius: 4,
		paddingLeft: 8,
		fontSize: 16,
		backgroundColor: '#DFDFDF'
	}
});

export default Social;
