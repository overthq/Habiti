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
	padded?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	action,
	padded = true
}) => {
	return (
		<View style={[styles.container, padded ? { paddingHorizontal: 16 } : {}]}>
			<Typography preset='sectionHeader'>{title}</Typography>
			{action ? (
				<TextButton size={15} onPress={action.onPress}>
					{action.text}
				</TextButton>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4
	}
});

export default SectionHeader;
