import React from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { Button, Screen, Spacer, Typography } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import {
	useCurrentUserQuery,
	CurrentUserQuery,
	PushTokenType,
	useSavePushTokenMutation,
	useDeletePushTokenMutation
} from '../types/api';

const getUserPushToken = (user: CurrentUserQuery['currentUser']) => {
	return user.pushTokens.find(token => token.type === PushTokenType.Shopper);
};

const NotificationSettings = () => {
	const [{ data }] = useCurrentUserQuery();
	const [, savePushToken] = useSavePushTokenMutation();
	const [, deletePushToken] = useDeletePushTokenMutation();

	useGoBack();

	if (!data?.currentUser) {
		return null;
	}

	const user = data.currentUser;

	const pushToken = getUserPushToken(user);

	const handleRegistrationError = (errorMessage: string) => {
		Alert.alert(errorMessage);
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

				await savePushToken({
					input: { token: pushTokenString, type: PushTokenType.Shopper }
				});
			} catch (e: unknown) {
				handleRegistrationError(`${e}`);
			}
		} else {
			handleRegistrationError(
				'Must use physical device for push notifications'
			);
		}
	};

	const handleDeletePushToken = async () => {
		await deletePushToken({
			input: { token: pushToken.token, type: PushTokenType.Shopper }
		});
	};

	if (!pushToken) {
		return (
			<Screen style={{ padding: 16 }}>
				<Typography weight='medium'>Push notifications</Typography>

				<Spacer y={16} />

				<Button
					text='Enable push notifications'
					onPress={requestPushPermission}
				/>
			</Screen>
		);
	}

	return (
		<Screen style={{ padding: 16 }}>
			<Typography weight='medium'>Push notifications</Typography>

			<Spacer y={16} />

			<Button
				text='Disable push notifications'
				onPress={handleDeletePushToken}
			/>
		</Screen>
	);
};

export default NotificationSettings;
