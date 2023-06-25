import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '../components/global/Button';
import UserCard from '../components/profile/UserCard';
import { useCurrentUserQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import ProfileRow from '../components/profile/ProfileRow';
import useStore from '../state';

/* Account Settings:
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
* Set up your own store*/

const Profile: React.FC = () => {
	const logOut = useStore(state => state.logOut);
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const [{ data, fetching }] = useCurrentUserQuery();

	const noop = React.useCallback(() => {
		// Something
	}, []);

	if (fetching || !data) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
				<UserCard user={data?.currentUser} />
			</View>
			<View style={styles.separator} />
			<View style={styles.section}>
				<ProfileRow
					title='Payment methods'
					onPress={() => navigate('Payment Methods')}
				/>
				<ProfileRow title='Delivery address' onPress={noop} />
				<ProfileRow title='Notifications' onPress={noop} />
				<ProfileRow title='About this app' onPress={noop} />
				<ProfileRow title='Support' onPress={noop} />
			</View>
			<View style={{ paddingHorizontal: 16, marginTop: 8 }}>
				<Button text='Log Out' onPress={logOut} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	section: {
		borderRadius: 4,
		marginBottom: 16
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: '#D3D3D3',
		marginBottom: 8
	}
});

export default Profile;
