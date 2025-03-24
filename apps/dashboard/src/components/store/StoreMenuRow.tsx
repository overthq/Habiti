import { Icon, IconType, Row, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StoreMenuRowProps {
	title: string;
	onPress(): void;
	display?: string;
	icon?: IconType;
	destructive?: boolean;
}

const StoreMenuRow: React.FC<StoreMenuRowProps> = ({
	title,
	onPress,
	display,
	icon = 'chevron-right',
	destructive = false
}) => {
	const { theme } = useTheme();
	return (
		<Row onPress={onPress} style={styles.menuButton}>
			<Typography variant={destructive ? 'error' : 'primary'}>
				{title}
			</Typography>
			<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
				{display && (
					<Typography variant='secondary' weight='regular'>
						{display}
					</Typography>
				)}
				<Icon
					name={icon}
					color={destructive ? theme.text.error : '#505050'}
					size={20}
				/>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	menuButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 16,
		paddingRight: 12,
		paddingVertical: 12
	}
});

export default StoreMenuRow;
