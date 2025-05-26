import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Spacer } from '@habiti/components';

interface SectionProps {
	title: string;
	children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
	return (
		<View style={styles.section}>
			<Typography weight='semibold' size='large'>
				{title}
			</Typography>
			<Spacer y={4} />
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingHorizontal: 16
	}
});

export default Section;
