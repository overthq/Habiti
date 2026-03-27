import React from 'react';
import { Alert, View } from 'react-native';
import { Screen, Typography, Spacer, Button } from '@habiti/components';

import { useDeleteAccountMutation } from '../data/mutations';

const ManageAccount = () => {
	const { mutate: deleteAccount } = useDeleteAccountMutation();

	const handleDeleteAccount = React.useCallback(() => {
		Alert.alert(
			'Delete Account',
			'Are you sure you want to delete your account? This action is permanent and cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => deleteAccount()
				}
			]
		);
	}, [deleteAccount]);

	return (
		<Screen style={{ padding: 16 }}>
			<View>
				<Typography weight='medium'>Danger Zone</Typography>
				<Spacer y={8} />
				<Typography variant='secondary'>
					Deleting your account will permanently remove all your data, including
					your stores, products, and order history.
				</Typography>
				<Spacer y={16} />
				<Button
					text='Delete Account'
					onPress={handleDeleteAccount}
					variant='destructive'
				/>
			</View>
		</Screen>
	);
};

export default ManageAccount;
