import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

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
		{cta && <Button text={cta.text} onPress={cta.action} />}
	</View>
);

const styles = StyleSheet.create({
	container: {
		height: 500,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	title: {
		fontSize: 18,
		color: '#100100',
		fontWeight: '500'
	},
	description: {
		fontSize: 16,
		color: '#505050',
		textAlign: 'center',
		marginVertical: 8
	}
});

export default ListEmpty;
