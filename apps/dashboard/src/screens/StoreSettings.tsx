import React from 'react';
import { Alert } from 'react-native';
import { Button, Screen, Spacer, Typography } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useDeleteStoreMutation } from '../types/api';

const StoreSettings = () => {
	const [, deleteStore] = useDeleteStoreMutation();
	const { activeStore, setPreference } = useStore();
	useGoBack();

	const handleDeleteStore = async () => {
		try {
			await deleteStore({ id: activeStore });
			setPreference({ activeStore: null });
		} catch (error) {
			Alert.alert('Error', 'Failed to delete store');
		}
	};

	const confirmDeleteStore = () => {
		Alert.alert(
			'Confirm store deletion',
			'Are you sure you want to delete this store? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: handleDeleteStore }
			]
		);
	};

	return (
		<Screen style={{ padding: 16 }}>
			<Typography variant='secondary' size='small'>
				You can delete the store using the button below. Please not that this
				will also delete all products, orders and payout information.
			</Typography>
			<Spacer y={8} />
			<Button
				text='Delete store'
				onPress={confirmDeleteStore}
				variant='destructive'
			/>
		</Screen>
	);
};

export default StoreSettings;
