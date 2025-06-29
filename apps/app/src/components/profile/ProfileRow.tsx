import { Icon, IconType, Row, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ProfileRowProps {
	title: string;
	onPress(): void;
	icon?: IconType;
	destructive?: boolean;
}

const ProfileRow: React.FC<ProfileRowProps> = ({
	title,
	onPress,
	icon = 'chevron-right',
	destructive = false
}) => {
	const { theme } = useTheme();

	return (
		<Row style={styles.container} onPress={onPress}>
			<Typography variant={destructive ? 'error' : 'primary'}>
				{title}
			</Typography>
			<Icon
				name={icon}
				color={destructive ? theme.text.error : theme.text.secondary}
				size={20}
			/>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12
	}
});

export default ProfileRow;
