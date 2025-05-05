import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountSettings from '../screens/AccountSettings';
import DeliveryAddress from '../screens/DeliveryAddress';
import EditProfile from '../screens/EditProfile';
import NotificationSettings from '../screens/NotificationSettings';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SettingsTheme from '../screens/SettingsTheme';
import { ProfileStackParamList } from '../types/navigation';
const ProfileNavigator = createNativeStackNavigator<
	ProfileStackParamList,
	'ProfileStack'
>();

const ProfileStack = () => {
	return (
		<ProfileNavigator.Navigator id='ProfileStack'>
			<ProfileNavigator.Screen
				name='Profile.Main'
				component={Profile}
				options={{ headerTitle: 'Profile' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.Edit'
				component={EditProfile}
				options={{ headerTitle: 'Edit Profile' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.PaymentMethods'
				component={PaymentMethods}
				options={{ headerTitle: 'Payment Methods' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.DeliveryAddress'
				component={DeliveryAddress}
				options={{ headerTitle: 'Delivery Address' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.NotificationSettings'
				component={NotificationSettings}
				options={{ headerTitle: 'Notifications' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.Appearance'
				component={SettingsTheme}
				options={{ headerTitle: 'Appearance' }}
			/>
			<ProfileNavigator.Screen
				name='Profile.AccountSettings'
				component={AccountSettings}
				options={{ headerTitle: 'Account Settings' }}
			/>
		</ProfileNavigator.Navigator>
	);
};

export default ProfileStack;
