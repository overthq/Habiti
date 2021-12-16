import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CurrentUserQuery } from '../../types/api';

interface UserCardProps {
	user: CurrentUserQuery['currentUser'];
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	return (
		<View style={styles.card}>
			<View style={styles.imagePlaceholder}>
				<Text style={styles.avatarText}>{user.name[0]}</Text>
			</View>
			<View style={{ marginLeft: 16 }}>
				<Text style={styles.name}>{user.name}</Text>
				<Text style={styles.phone}>{user.phone}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 4,
		backgroundColor: '#FFFFFF',
		width: '100%',
		padding: 12,
		marginVertical: 16,
		flexDirection: 'row'
	},
	imagePlaceholder: {
		height: 50,
		width: 50,
		backgroundColor: '#D3D3D3',
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center'
	},
	avatarText: {
		color: '#505050',
		fontWeight: '500',
		fontSize: 24
	},

	name: {
		fontWeight: '500',
		fontSize: 18
	},
	phone: {
		fontSize: 16,
		marginTop: 2,
		color: '#505050'
	}
});

export default UserCard;
