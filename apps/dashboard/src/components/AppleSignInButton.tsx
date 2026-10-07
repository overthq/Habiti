import React from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Button } from '@habiti/components';

import { useAppleSignInMutation } from '../data/mutations';

const APPLE_LOGO = '\uF8FF';
const EN_SPACE = '\u2002';

export const useAppleSignInAvailable = () => {
	const [available, setAvailable] = React.useState(Platform.OS === 'ios');

	React.useEffect(() => {
		if (Platform.OS === 'ios') {
			AppleAuthentication.isAvailableAsync().then(setAvailable);
		}
	}, []);

	return available;
};

const AppleSignInButton: React.FC = () => {
	const available = useAppleSignInAvailable();
	const appleSignInMutation = useAppleSignInMutation();

	if (!available) return null;

	return (
		<Button
			variant='secondary'
			text={`${APPLE_LOGO}${EN_SPACE}Sign in with Apple`}
			loading={appleSignInMutation.isPending}
			onPress={() => appleSignInMutation.mutate()}
		/>
	);
};

export default AppleSignInButton;
