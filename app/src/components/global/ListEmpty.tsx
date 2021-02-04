import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ListEmptyProps {
	title: string;
	description: string;
	cta?: {
		text: string;
		action(): void;
	};
}

const ListEmpty: React.FC<ListEmptyProps> = ({ title, description, cta }) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.description}>{description}</Text>
		{cta && (
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.button}
				onPress={cta.action}
			>
				<Text style={styles.buttonText}>{cta.text}</Text>
			</TouchableOpacity>
		)}
	</View>
);

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '95%',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	title: {
		fontSize: 22,
		color: '#100100',
		fontWeight: '500'
	},
	description: {
		fontSize: 16,
		color: '#505050',
		textAlign: 'center',
		marginVertical: 8
	},
	button: {
		padding: 10,
		backgroundColor: '#505050',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		color: '#FFFFFF',
		fontWeight: '500',
		fontSize: 16
	}
});

export default ListEmpty;
