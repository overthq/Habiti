import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';

interface ProfileRowProps {
	title: string;
	onPress(): void;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ title, onPress }) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Text style={styles.title}>{title}</Text>
			<Icon name='chevronRight' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 12,
		borderRadius: 4,
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 16
	}
});

export default ProfileRow;
