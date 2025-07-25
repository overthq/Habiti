import React, { useCallback } from 'react';
import { View, Switch, Alert } from 'react-native';

import { Screen, Typography, useTheme } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import {
	useCurrentUserQuery,
	CurrentUserQuery,
	PushTokenType,
	useSavePushTokenMutation,
	useDeletePushTokenMutation
} from '../types/api';
import { useMutation } from '@tanstack/react-query';
import { requestPushPermission } from '../utils/notifications';

const getUserPushToken = (user: CurrentUserQuery['currentUser']) => {
	return user.pushTokens.find(token => token.type === PushTokenType.Shopper);
};

const NotificationSettings = () => {
	const [{ data }] = useCurrentUserQuery();
	const [, savePushToken] = useSavePushTokenMutation();
	const [, deletePushToken] = useDeletePushTokenMutation();
	const { theme } = useTheme();

	useGoBack();

	if (!data?.currentUser) return null;

	const user = data.currentUser;

	const pushToken = getUserPushToken(user);
	const isPushEnabled = !!pushToken;

	const requestPushTokenMutation = useMutation({
		mutationFn: async () => {
			const pushTokenString = await requestPushPermission();
			await savePushToken({
				input: { token: pushTokenString, type: PushTokenType.Shopper }
			});
		},
		onError: error => {
			Alert.alert(error.message || error.toString());
		}
	});

	const handleDeletePushToken = async () => {
		await deletePushToken({
			input: { token: pushToken.token, type: PushTokenType.Shopper }
		});
	};

	const handleTogglePush = useCallback(async () => {
		if (isPushEnabled) {
			await handleDeletePushToken();
		} else {
			await requestPushTokenMutation.mutateAsync();
		}
	}, [isPushEnabled, handleDeletePushToken, requestPushTokenMutation]);

	return (
		<Screen style={{ padding: 16 }}>
			<View
				style={{
					backgroundColor: theme.input.background,
					paddingHorizontal: 12,
					paddingVertical: 8,
					borderRadius: 8,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<Typography>Push notifications</Typography>
				<Switch
					disabled={true}
					style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
					value={isPushEnabled}
					onValueChange={handleTogglePush}
				/>
			</View>
		</Screen>
	);
};

export default NotificationSettings;
