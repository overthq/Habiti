import { Icon, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface ProfileRowProps {
	title: string;
	onPress(): void;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ title, onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Typography>{title}</Typography>
			<Icon name='chevron-right' color={theme.text.secondary} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16
	}
});

export default ProfileRow;
