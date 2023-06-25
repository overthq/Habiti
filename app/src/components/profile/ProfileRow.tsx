import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Icon } from '../Icon';

interface ProfileRowProps {
	title: string;
	onPress(): void;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ title, onPress }) => (
	<Pressable style={styles.container} onPress={onPress}>
		<Text style={styles.title}>{title}</Text>
		<Icon name='chevron-right' />
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		fontSize: 16
	}
});

export default ProfileRow;
