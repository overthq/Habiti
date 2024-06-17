import { Button, Screen } from '@habiti/components';
import React from 'react';
import { Alert } from 'react-native';

import useGoBack from '../hooks/useGoBack';

const AccountSettings = () => {
	useGoBack();

	const confirmDeleteAccount = () => {
		Alert.alert(
			'Confirm account deletion',
			'Are you sure you want to delete your account? This action is irreversible.',
			[{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }]
		);
	};

	return (
		<Screen style={{ padding: 16 }}>
			<Button
				text='Delete account'
				variant='destructive'
				onPress={confirmDeleteAccount}
			/>
		</Screen>
	);
};

export default AccountSettings;
