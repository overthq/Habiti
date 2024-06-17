import { Button, Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import ProfileRow from '../components/profile/ProfileRow';
import UserCard from '../components/profile/UserCard';
import useStore from '../state';
import { useCurrentUserQuery } from '../types/api';
import { ProfileStackParamList } from '../types/navigation';

/* Account Settings:
  - Account Info
  - Addresses
  - Loyalty Cards (list followed stores that support loyalty cards.)
  - Country*
	- Habiti Pro* (subscription membership with perks).
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
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
	const { theme } = useTheme();

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
		<Screen>
			<View style={{ paddingHorizontal: 16 }}>
				<UserCard user={data?.currentUser} />
			</View>
			<View
				style={[styles.separator, { backgroundColor: theme.border.color }]}
			/>
			<View style={styles.section}>
				<ProfileRow
					title='Payment methods'
					onPress={() => navigate('Payment Methods')}
				/>
				<ProfileRow
					title='Delivery address'
					onPress={() => navigate('DeliveryAddress')}
				/>
				<ProfileRow
					title='Notifications'
					onPress={() => navigate('NotificationSettings')}
				/>
				<ProfileRow title='Appearance' onPress={() => navigate('Appearance')} />
				<ProfileRow
					title='Manage account'
					onPress={() => navigate('Profile.AccountSettings')}
				/>
				<View
					style={[styles.separator, { backgroundColor: theme.border.color }]}
				/>
				<ProfileRow title='About this app' onPress={noop} />
				<ProfileRow title='Support' onPress={noop} />
			</View>
			<View style={{ paddingHorizontal: 16, marginTop: 8 }}>
				<Button text='Log Out' onPress={logOut} />
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	section: {
		marginBottom: 16
	},
	separator: {
		height: 1,
		marginVertical: 8,
		marginHorizontal: 16
	}
});

export default Profile;
