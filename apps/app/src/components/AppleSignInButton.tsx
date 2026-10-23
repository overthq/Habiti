import React from 'react';
import { Button } from '@habiti/components';

import { useAppleSignInMutation } from '../hooks/mutations';
import { useAppleSignInAvailable } from '../hooks/useAuth';

const APPLE_LOGO = '\uF8FF';
const EN_SPACE = '\u2002';

const AppleSignInButton: React.FC = () => {
	const available = useAppleSignInAvailable();
	const appleSignInMutation = useAppleSignInMutation();

	if (!available) return null;

	return (
		<Button
			variant='primary'
			text={`${APPLE_LOGO}${EN_SPACE}Sign in with Apple`}
			loading={appleSignInMutation.isPending}
			onPress={() => appleSignInMutation.mutate()}
		/>
	);
};

export default AppleSignInButton;
