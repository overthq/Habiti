import { Typography, useTheme } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { CurrentUserQuery } from '../../types/api';
import { ProfileStackParamList } from '../../types/navigation';

interface UserCardProps {
	user: CurrentUserQuery['currentUser'];
}

// TODO: Replace "Edit profile" with {user.email}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={() => navigate('Edit Profile')}
			style={[styles.card, { backgroundColor: theme.input.background }]}
		>
			<View
				style={[
					styles.placeholder,
					{ backgroundColor: theme.image.placeholder }
				]}
			>
				<Typography weight='medium' size='xxlarge'>
					{user.name[0]}
				</Typography>
			</View>
			<View style={{ marginLeft: 12 }}>
				<Typography weight='medium'>{user.name}</Typography>
				<Typography variant='secondary' style={styles.phone}>
					{/* {user.phone} */}
					Edit profile
				</Typography>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 4,
		padding: 12,
		marginTop: 16,
		marginBottom: 8,
		flexDirection: 'row'
	},
	placeholder: {
		height: 40,
		width: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	phone: {
		marginTop: 2
	}
});

export default UserCard;
