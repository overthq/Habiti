import { Typography, useTheme } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

import { useCurrentUserQuery } from '../../types/api';
import { ProfileStackParamList } from '../../types/navigation';

// TODO: Replace "Edit profile" with {user.email}

const UserCard: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
	const { theme } = useTheme();

	const [{ data, fetching }] = useCurrentUserQuery();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Pressable onPress={() => navigate('Edit Profile')} style={[styles.card]}>
			<View
				style={[
					styles.placeholder,
					{ backgroundColor: theme.image.placeholder }
				]}
			>
				<Typography weight='medium' size='xxlarge'>
					{data.currentUser.name[0]}
				</Typography>
			</View>
			<View style={{ marginLeft: 12 }}>
				<Typography weight='medium'>{data.currentUser.name}</Typography>
				<Typography variant='secondary' style={styles.phone}>
					Edit profile
				</Typography>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		marginHorizontal: 16,
		marginTop: 16,
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	placeholder: {
		height: 52,
		width: 52,
		borderRadius: 26,
		justifyContent: 'center',
		alignItems: 'center'
	},
	phone: {
		marginTop: 2
	}
});

export default UserCard;
