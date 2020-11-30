import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ListEmptyProps {
	title: string;
	description: string;
	ctaText: string;
	ctaAction(): void;
}

const ListEmpty: React.FC<ListEmptyProps> = ({
	title,
	description,
	ctaText,
	ctaAction
}) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.description}>{description}</Text>
		<TouchableOpacity style={styles.button} onPress={ctaAction}>
			<Text style={styles.buttonText}>{ctaText}</Text>
		</TouchableOpacity>
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	title: {
		fontSize: 20,
		fontWeight: '500',
		color: '#505050'
	},
	description: {
		fontSize: 14,
		color: '#D3D3D3'
	},
	button: {
		padding: 15,
		backgroundColor: '#505050',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		color: '#D3D3D3',
		fontWeight: '500',
		fontSize: 14
	}
});

export default ListEmpty;
