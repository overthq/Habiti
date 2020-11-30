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
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.button}
			onPress={ctaAction}
		>
			<Text style={styles.buttonText}>{ctaText}</Text>
		</TouchableOpacity>
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: '95%',
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
