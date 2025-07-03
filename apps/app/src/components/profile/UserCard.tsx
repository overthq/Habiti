import React from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Avatar, Spacer, Typography } from '@habiti/components';

import { useCurrentUserQuery } from '../../types/api';
import { ProfileStackParamList } from '../../types/navigation';

const UserCard: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

	const [{ data, fetching }] = useCurrentUserQuery();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Pressable onPress={() => navigate('Profile.Edit')} style={styles.card}>
			<Avatar size={52} circle fallbackText={data.currentUser.name} />
			<View style={{ marginLeft: 12 }}>
				<Typography weight='medium'>{data.currentUser.name}</Typography>
				<Spacer y={2} />
				<Typography variant='secondary'>{data.currentUser.email}</Typography>
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
	}
});

export default UserCard;
