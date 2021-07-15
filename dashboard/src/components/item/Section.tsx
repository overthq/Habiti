import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
	title: string;
	content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => {
	return (
		<View style={styles.section}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.content}>{content} NGN</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	content: {
		fontSize: 16
	}
});

export default Section;
