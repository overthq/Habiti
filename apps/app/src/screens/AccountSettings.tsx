import React from 'react';
import { Alert } from 'react-native';
import { Button, Screen, Spacer, Typography } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import { useDeleteAccountMutation } from '../types/api';

const AccountSettings = () => {
	const [, deleteAccount] = useDeleteAccountMutation();
	useGoBack();

	const handleDeleteAccount = async () => {
		await deleteAccount({});
	};

	const confirmDeleteAccount = () => {
		Alert.alert(
			'Confirm account deletion',
			'Are you sure you want to delete your account? This action is irreversible.',
			[
				{ text: 'Cancel' },
				{ text: 'Delete', style: 'destructive', onPress: handleDeleteAccount }
			]
		);
	};

	return (
		<Screen style={{ padding: 16 }}>
			<Typography size='small' variant='secondary'>
				You can delete your account and all related data with the button below.
				Please note that this action is irreversible.
			</Typography>
			<Spacer y={16} />
			<Button
				text='Delete account'
				variant='destructive'
				onPress={confirmDeleteAccount}
			/>
		</Screen>
	);
};

export default AccountSettings;
