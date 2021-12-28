import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '../components/global/Button';
import UserCard from '../components/profile/UserCard';
import { logOut } from '../redux/auth/actions';
import { useCurrentUserQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ProfileRow from '../components/profile/ProfileRow';

const Profile: React.FC = () => {
	const dispatch = useDispatch();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const [{ data, fetching }] = useCurrentUserQuery();

	if (fetching || !data) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<UserCard user={data?.currentUser} />
			<ProfileRow
				title='Payment methods'
				onPress={() => navigate('Payment Methods')}
			/>
			<Button text='Log Out' onPress={() => dispatch(logOut())} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Profile;
