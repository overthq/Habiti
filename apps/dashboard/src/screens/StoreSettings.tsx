import { Button, Screen } from '@habiti/components';
import React from 'react';
import { Alert } from 'react-native';

import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useDeleteStoreMutation } from '../types/api';
import { useShallow } from 'zustand/react/shallow';

const StoreSettings = () => {
	const [, deleteStore] = useDeleteStoreMutation();
	const activeStore = useStore(useShallow(({ activeStore }) => activeStore));
	useGoBack();

	const handleDeleteStore = () => {
		// Redundant check
		if (activeStore) {
			deleteStore({ id: activeStore });
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
			<Button
				text='Delete store'
				onPress={confirmDeleteStore}
				variant='destructive'
			/>
		</Screen>
	);
};

export default StoreSettings;
