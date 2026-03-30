import React from 'react';
import { View, Switch, Alert, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

import { Screen, Typography, useTheme } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import { usePushTokensQuery } from '../data/queries';
import {
	useSavePushTokenMutation,
	useDeletePushTokenMutation
} from '../data/mutations';
import { PushTokenType, UserPushToken } from '../data/types';
import { useMutation } from '@tanstack/react-query';
import { requestPushPermission } from '../utils/notifications';

const getUserPushToken = (pushTokens: UserPushToken[]) => {
	return pushTokens.find(token => token.type === PushTokenType.Shopper);
};

const NotificationSettings = () => {
	const { data } = usePushTokensQuery();
	const savePushToken = useSavePushTokenMutation();
	const deletePushToken = useDeletePushTokenMutation();
	const { theme } = useTheme();

	useGoBack();

	const pushTokens = data?.pushTokens ?? [];
	const pushToken = getUserPushToken(pushTokens);
	const isPushEnabled = !!pushToken;

	const requestPushTokenMutation = useMutation({
		mutationFn: async () => {
			const pushTokenString = await requestPushPermission();
			await savePushToken.mutateAsync({
				token: pushTokenString,
				type: PushTokenType.Shopper
			});
		},
		onError: error => {
			Alert.alert(error.message || error.toString());
		}
	});

	const switchValue =
		isPushEnabled ||
		requestPushTokenMutation.isPending ||
		requestPushTokenMutation.isSuccess;
	const switchDisabled = requestPushTokenMutation.isPending || !Device.isDevice;

	const handleDeletePushToken = async () => {
		await deletePushToken.mutateAsync({
			token: pushToken!.token,
			type: PushTokenType.Shopper
		});
	};

	const handleTogglePush = React.useCallback(async () => {
		if (isPushEnabled) {
			await handleDeletePushToken();
		} else {
			await requestPushTokenMutation.mutateAsync();
		}
	}, [isPushEnabled, handleDeletePushToken, requestPushTokenMutation]);

	return (
		<Screen style={{ padding: 16 }}>
			<View style={[styles.row, { backgroundColor: theme.input.background }]}>
				<Typography>Push notifications</Typography>
				<Switch
					disabled={switchDisabled}
					style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
					value={switchValue}
					onValueChange={handleTogglePush}
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	row: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default NotificationSettings;
