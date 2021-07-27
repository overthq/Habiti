import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

const Social = () => {
	const { handleChange, handleBlur } = useFormikContext<{
		twitter: string;
		instagram: string;
		website: string;
	}>();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Social media</Text>
			<Text>
				Link your social accounts, so shoppers can follow you elsewhere.
			</Text>
			<View>
				<Text>Twitter username</Text>
				<TextInput
					style={styles.input}
					placeholder='@nike'
					onChangeText={handleChange('twitter')}
					onBlur={handleBlur('twitter')}
				/>
			</View>
			<View>
				<Text>Instagram username</Text>
				<TextInput
					style={styles.input}
					placeholder='@nike'
					onChangeText={handleChange('instagram')}
					onBlur={handleBlur('instagram')}
				/>
			</View>
			<View>
				<Text>Website</Text>
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
		padding: 16
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold'
	},
	input: {
		paddingLeft: 8,
		backgroundColor: '#DFDFDF'
	}
});

export default Social;
