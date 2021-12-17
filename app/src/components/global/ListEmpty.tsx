import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Button from './Button';

interface ListEmptyProps {
	title: string;
	description: string;
	cta?: {
		text: string;
		action(): void;
	};
	viewStyle?: ViewStyle;
}

const ListEmpty: React.FC<ListEmptyProps> = ({
	title,
	description,
	cta,
	viewStyle
}) => (
	<View style={[styles.container, viewStyle]}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.description}>{description}</Text>
		{cta && (
			<Button style={styles.button} text={cta.text} onPress={cta.action} />
		)}
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center'
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
	},
	button: {
		marginHorizontal: 16
	}
});

export default ListEmpty;
