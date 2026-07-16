import React from 'react';
import { Platform } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';

import { useCurrentUserQuery } from '../data/queries';
import type { AppStackParamList, AuthEntryScreen } from '../navigation/types';

export const useIsGuest = () => {
	const { data } = useCurrentUserQuery();

	return data?.user?.isAnonymous ?? false;
};

/**
 * Whether Sign in with Apple can be offered. Callers need this to decide
 * whether to render the surrounding chrome (dividers, spacing), not just the
 * button itself, which would otherwise be left stranded on Android.
 */
export const useAppleSignInAvailable = () => {
	const [available, setAvailable] = React.useState(false);

	React.useEffect(() => {
		if (Platform.OS === 'ios') {
			AppleAuthentication.isAvailableAsync().then(setAvailable);
		}
	}, []);

	return available;
};

export const useOpenAuthModal = () => {
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	return React.useCallback(
		(screen: AuthEntryScreen = 'Auth.Main') => {
			navigation.navigate('Modal.Auth', { screen });
		},
		[navigation]
	);
};

/**
 * Dismisses the auth modal by popping it off the stack that presented it,
 * revealing the screen the user was on when they were asked to sign in.
 * Signing in is also possible outside the modal (from Landing), so this only
 * acts when the modal is the screen actually being presented.
 */
export const useDismissAuthModal = () => {
	const navigation = useNavigation();

	return React.useCallback(() => {
		const appStack =
			navigation.getParent<NativeStackNavigationProp<AppStackParamList>>(
				'AppStack'
			);

		if (!appStack) return;

		const { routes, index } = appStack.getState();

		if (routes[index]?.name === 'Modal.Auth') {
			appStack.goBack();
		}
	}, [navigation]);
};
