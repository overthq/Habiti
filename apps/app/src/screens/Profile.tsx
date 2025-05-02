import {
	Button,
	Screen,
	ScreenHeader,
	Separator,
	Spacer
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProfileRow from '../components/profile/ProfileRow';
import UserCard from '../components/profile/UserCard';
import useStore from '../state';
import { ProfileStackParamList } from '../types/navigation';
import { useShallow } from 'zustand/react/shallow';

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
	const { top } = useSafeAreaInsets();

	const confirmLogOut = React.useCallback(() => {
		Alert.alert('Log Out', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Log Out', style: 'destructive', onPress: logOut }
		]);
	}, [logOut]);

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Profile' />
			<UserCard />
			{/* <Spacer y={8} /> */}
			<Separator style={{ marginHorizontal: 16 }} />
			{/* <Spacer y={8} /> */}
			<View>
				{/* <ProfileRow
					title='Delivery Addresses'
					onPress={() => navigate('Profile.DeliveryAddress')}
				/> */}
				{/* <ProfileRow
					title='Notifications'
					onPress={() => navigate('Profile.NotificationSettings')}
				/> */}
				<ProfileRow
					title='Manage Account'
					onPress={() => navigate('Profile.AccountSettings')}
				/>
				<ProfileRow
					title='Payment Methods'
					onPress={() => navigate('Profile.PaymentMethods')}
				/>
				<ProfileRow
					title='Appearance'
					onPress={() => navigate('Profile.Appearance')}
				/>
				{/* <Spacer y={8} /> */}
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
			</View>
			<Spacer y={24} />
			<View style={{ paddingHorizontal: 16 }}>
				<Button text='Log Out' onPress={confirmLogOut} />
			</View>
		</Screen>
	);
};

export default Profile;
