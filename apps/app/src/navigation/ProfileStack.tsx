import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountSettings from '../screens/AccountSettings';
import DeliveryAddress from '../screens/DeliveryAddress';
import EditProfile from '../screens/EditProfile';
import NotificationSettings from '../screens/NotificationSettings';
import PaymentMethods from '../screens/PaymentMethods';
import Profile from '../screens/Profile';
import SettingsTheme from '../screens/SettingsTheme';
import { ProfileStackParamList } from '../types/navigation';
const ProfileNavigator = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
	return (
		<ProfileNavigator.Navigator>
			<ProfileNavigator.Screen
				name='Profile.Main'
				component={Profile}
				options={{ headerTitle: 'Profile' }}
			/>
			<ProfileNavigator.Screen name='Edit Profile' component={EditProfile} />
			<ProfileNavigator.Screen
				name='Payment Methods'
				component={PaymentMethods}
			/>
			<ProfileNavigator.Screen
				name='DeliveryAddress'
				component={DeliveryAddress}
				options={{ headerTitle: 'Delivery Address' }}
			/>
			<ProfileNavigator.Screen
				name='NotificationSettings'
				component={NotificationSettings}
				options={{ headerTitle: 'Notifications' }}
			/>
			<ProfileNavigator.Screen name='Appearance' component={SettingsTheme} />
			<ProfileNavigator.Screen
				name='Profile.AccountSettings'
				component={AccountSettings}
				options={{ headerTitle: 'Account Settings' }}
			/>
		</ProfileNavigator.Navigator>
	);
};

export default ProfileStack;
