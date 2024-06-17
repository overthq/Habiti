import { Icon, Typography } from '@habiti/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface StoreMenuRowProps {
	title: string;
	onPress(): void;
}

const StoreMenuRow: React.FC<StoreMenuRowProps> = ({ title, onPress }) => {
	return (
		<Pressable style={styles.menuButton} onPress={onPress}>
			<Typography>{title}</Typography>
			<Icon name='chevron-right' color='#505050' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	menuButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8
	}
});

export default StoreMenuRow;
