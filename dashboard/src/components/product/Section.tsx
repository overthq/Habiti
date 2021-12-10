import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionProps {
	title: string;
	content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
	<View style={styles.section}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.content}>{content}</Text>
	</View>
);

const styles = StyleSheet.create({
	section: {
		paddingVertical: 4,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		marginBottom: 2,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	content: {
		fontSize: 16
	}
});

export default Section;
