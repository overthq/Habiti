import React from 'react';
import { Alert, Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Screen, Separator } from '@habiti/components';
import { useShallow } from 'zustand/react/shallow';

import ProfileRow from '../components/profile/ProfileRow';
import UserCard from '../components/profile/UserCard';

import useStore from '../state';
import useGoBack from '../hooks/useGoBack';

import { ProfileStackParamList } from '../types/navigation';

const PRIVACY_POLICY_URL = 'https://habiti.app/privacy-policy';
const SUPPORT_URL = 'https://habiti.app/support';
const ACCEPTABLE_USE_URL = 'https://habiti.app/acceptable-use';

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
	const logOut = useStore(useShallow(state => state.logOut));
	const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();
	useGoBack('x');

	const confirmLogOut = React.useCallback(() => {
		Alert.alert('Log Out', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Log Out', style: 'destructive', onPress: logOut }
		]);
	}, [logOut]);

	return (
		<Screen>
			<UserCard />
			<Separator style={{ marginHorizontal: 16 }} />
			<ProfileRow
				title='Manage Account'
				onPress={() => navigate('Profile.AccountSettings')}
			/>
			<ProfileRow
				title='Payment Methods'
				onPress={() => navigate('Profile.PaymentMethods')}
			/>
			<ProfileRow
				title='Notifications'
				onPress={() => navigate('Profile.NotificationSettings')}
			/>
			<ProfileRow
				title='Appearance'
				onPress={() => navigate('Profile.Appearance')}
			/>
			<Separator inset />
			<ProfileRow
				title='Privacy Policy'
				onPress={() => {
					Linking.openURL(PRIVACY_POLICY_URL);
				}}
				icon='arrow-up-right'
			/>
			<ProfileRow
				title='Support'
				onPress={() => {
					Linking.openURL(SUPPORT_URL);
				}}
				icon='arrow-up-right'
			/>
			<ProfileRow
				title='Acceptable Use'
				onPress={() => {
					Linking.openURL(ACCEPTABLE_USE_URL);
				}}
				icon='arrow-up-right'
			/>
			<ProfileRow
				title='Log Out'
				onPress={confirmLogOut}
				icon='log-out'
				destructive
			/>
		</Screen>
	);
};

export default Profile;
