import { Button, Screen, TextButton, Typography } from '@habiti/components';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, Platform } from 'react-native';

const OnboardingPushNotifications = () => {
	return (
		<Screen>
			<Typography>Turn on push notifications</Typography>
			<Button text='Turn on' onPress={requestPushPermission} />
			<TextButton>Turn on later</TextButton>
		</Screen>
	);
};

export default OnboardingPushNotifications;

const handleRegistrationError = (errorMessage: string) => {
	Alert.alert(errorMessage);
	throw new Error(errorMessage);
};

const requestPushPermission = async () => {
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C'
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			handleRegistrationError(
				'Permission not granted to get push token for push notification!'
			);
			return;
		}
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId;
		if (!projectId) {
			handleRegistrationError('Project ID not found');
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId
				})
			).data;
			console.log(pushTokenString);
			return pushTokenString;
		} catch (e: unknown) {
			handleRegistrationError(`${e}`);
		}
	} else {
		handleRegistrationError('Must use physical device for push notifications');
	}
};
