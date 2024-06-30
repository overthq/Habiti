import { Button, Screen, Separator, Spacer } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import ProfileRow from '../components/profile/ProfileRow';
import UserCard from '../components/profile/UserCard';
import useStore from '../state';
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

	const noop = React.useCallback(() => {
		// Something
	}, []);

	return (
		<Screen>
			<UserCard />
			<Spacer y={8} />
			<Separator style={{ marginHorizontal: 16 }} />
			<Spacer y={8} />
			<View>
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
				<Spacer y={8} />
				<Separator style={{ marginHorizontal: 16 }} />
				<Spacer y={8} />
				<ProfileRow title='About this app' onPress={noop} />
				<ProfileRow title='Support' onPress={noop} />
			</View>
			<Spacer y={16} />
			<View style={{ paddingHorizontal: 16, marginTop: 8 }}>
				<Button text='Log Out' onPress={logOut} />
			</View>
		</Screen>
	);
};

export default Profile;
