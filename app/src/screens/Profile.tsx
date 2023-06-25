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

	if (fetching || !data) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator />
			</View>
		);
	}

	const noop = React.useCallback(() => {
		// Something
	}, []);

	return (
		<View style={styles.container}>
			<UserCard user={data?.currentUser} />
			<View style={styles.section}>
				<ProfileRow
					title='Payment methods'
					onPress={() => navigate('Payment Methods')}
				/>
				<View style={styles.separator} />
				<ProfileRow title='Delivery address' onPress={noop} />
				<View style={styles.separator} />
				<ProfileRow title='Notifications' onPress={noop} />
				<View style={styles.separator} />
				<ProfileRow title='About this app' onPress={noop} />
				<View style={styles.separator} />
				<ProfileRow title='Support' onPress={noop} />
			</View>
			<Button text='Log Out' onPress={logOut} />
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
		paddingHorizontal: 16
	},
	section: {
		borderRadius: 4,
		overflow: 'hidden',
		marginBottom: 16,
		backgroundColor: 'red'
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: '#D3D3D3'
	}
});

export default Profile;
