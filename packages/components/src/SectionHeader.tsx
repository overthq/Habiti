import React from 'react';
import { View, StyleSheet } from 'react-native';

import TextButton from './TextButton';
import Typography from './Typography';

interface SectionHeaderProps {
	title: string;
	action?: {
		text: string;
		onPress(): void;
	};
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => {
	return (
		<View style={styles.container}>
			<Typography preset='sectionHeader'>{title}</Typography>
			{action ? (
				<TextButton onPress={action.onPress}>{action.text}</TextButton>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 8
	}
});

export default SectionHeader;
