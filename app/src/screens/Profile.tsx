import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '../components/global/Button';
import UserCard from '../components/profile/UserCard';
import { useCurrentUserQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ProfileRow from '../components/profile/ProfileRow';
import useStore from '../state';

const Profile: React.FC = () => {
	const logOut = useStore(state => state.logOut);
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
			<View style={{ borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
				<ProfileRow
					title='Payment methods'
					onPress={() => navigate('Payment Methods')}
				/>
				<View
					style={{
						width: '100%',
						height: 1,
						backgroundColor: '#D3D3D3',
						marginHorizontal: 12
					}}
				/>
				<ProfileRow
					title='Delivery address'
					onPress={() => {
						// Something something
					}}
				/>
			</View>
			{/*
				* Account Settings:
				  - Account Info
				  - Addresses
				  - Loyalty Cards (list followed stores that support loyalty cards.)
				  - Notifications
			    - Country*
				* About this app
				  - Legal
					- TOS
					- Privacy Policy
					- OSS Packages*
					- Version Number*
				* Support
				* Set up your own store
			*/}
			<Button text='Log Out' onPress={logOut} />
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
