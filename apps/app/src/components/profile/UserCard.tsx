import { Typography } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { CurrentUserQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface UserCardProps {
	user: CurrentUserQuery['currentUser'];
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<Pressable onPress={() => navigate('Edit Profile')} style={styles.card}>
			<View style={styles.placeholder}>
				<Typography weight='medium' size='xxlarge'>
					{user.name[0]}
				</Typography>
			</View>
			<View style={{ marginLeft: 12 }}>
				<Typography weight='medium'>{user.name}</Typography>
				<Typography variant='secondary' style={styles.phone}>
					{user.phone}
				</Typography>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 4,
		width: '100%',
		padding: 12,
		marginVertical: 16,
		flexDirection: 'row'
	},
	placeholder: {
		height: 40,
		width: 40,
		backgroundColor: '#D3D3D3',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	phone: {
		marginTop: 2
	}
});

export default UserCard;
