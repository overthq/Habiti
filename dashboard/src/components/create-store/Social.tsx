import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { useFormikContext } from 'formik';

const { width } = Dimensions.get('window');

const Social = () => {
	const { handleChange, handleBlur } = useFormikContext<{
		twitter: string;
		instagram: string;
		website: string;
	}>();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Social media</Text>
			<Text style={styles.description}>
				Link your social accounts, so shoppers can follow you elsewhere.
			</Text>
			<View>
				<Text style={styles.label}>Twitter username</Text>
				<TextInput
					style={styles.input}
					placeholder='@nike'
					onChangeText={handleChange('twitter')}
					onBlur={handleBlur('twitter')}
				/>
			</View>
			<View>
				<Text style={styles.label}>Instagram username</Text>
				<TextInput
					style={styles.input}
					placeholder='@nike'
					onChangeText={handleChange('instagram')}
					onBlur={handleBlur('instagram')}
				/>
			</View>
			<View>
				<Text style={styles.label}>Website</Text>
				<TextInput
					style={styles.input}
					placeholder='https://nike.com'
					onChangeText={handleChange('website')}
					onBlur={handleBlur('website')}
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
		fontSize: 32,
		fontWeight: 'bold'
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
		height: 40,
		borderRadius: 4,
		paddingLeft: 8,
		fontSize: 16,
		backgroundColor: '#DFDFDF'
	}
});

export default Social;
