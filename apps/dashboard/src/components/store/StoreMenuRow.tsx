import { Icon, Row, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface StoreMenuRowProps {
	title: string;
	onPress(): void;
}

const StoreMenuRow: React.FC<StoreMenuRowProps> = ({ title, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.menuButton}>
			<Typography>{title}</Typography>
			<Icon name='chevron-right' color='#505050' />
		</Row>
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
