import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextButton from './TextButton';

interface SectionHeaderProps {
	title: string;
	action?: {
		text: string;
		onPress: () => void;
	};
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
		{action && <TextButton onPress={action.onPress}>{action.text}</TextButton>}
	</View>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	},
	title: {
		fontSize: 18,
		color: '#000000'
	}
});

export default SectionHeader;
