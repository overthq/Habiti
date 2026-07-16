import React from 'react';
import { useTheme } from '@habiti/components';
import * as AppleAuthentication from 'expo-apple-authentication';

import { useAppleSignInMutation } from '../hooks/mutations';
import { useAppleSignInAvailable } from '../hooks/useAuth';

const AppleSignInButton: React.FC = () => {
	const available = useAppleSignInAvailable();
	const appleSignInMutation = useAppleSignInMutation();
	const { name } = useTheme();

	if (!available) return null;

	return (
		<AppleAuthentication.AppleAuthenticationButton
			buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={
				name === 'dark'
					? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
					: AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
			}
			cornerRadius={8}
			style={{ height: 44 }}
			onPress={() => appleSignInMutation.mutate()}
		/>
	);
};

export default AppleSignInButton;
