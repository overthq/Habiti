import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const PROJECT_ID =
	Constants?.expoConfig?.extra?.eas?.projectId ??
	Constants?.easConfig?.projectId;

export const requestPushPermission = async () => {
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C'
		});
	}

	if (!Device.isDevice) {
		throw new Error('Must use physical device for push notifications');
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		throw new Error(
			'Permission not granted to get push token for push notification!'
		);
	}

	if (!PROJECT_ID) {
		throw new Error('Project ID not found');
	}

	const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({
		projectId: PROJECT_ID
	});

	return pushTokenString;
};
