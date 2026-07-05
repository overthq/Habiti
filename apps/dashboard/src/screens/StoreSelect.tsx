import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Spacer, Typography } from '@habiti/components';

import StoreSelectList from '../components/store-select/StoreSelectList';

import { useManagedStoresQuery } from '../data/queries';
import type { AppStackScreenProps } from '../navigation/types';
import { STORE_CREATION_ENABLED } from '../utils/constants';

const StoreSelect: React.FC<AppStackScreenProps<'StoreSelect'>> = ({
	navigation
}) => {
	const { isLoading, data } = useManagedStoresQuery();

	const handleAddStore = React.useCallback(() => {
		navigation.navigate('Modal.CreateStore');
	}, [navigation]);

	if (isLoading || !data) {
		return <View />;
	}

	const hasStores = data.stores.length > 0;

	if (!STORE_CREATION_ENABLED && !hasStores) {
		return (
			<Screen>
				<SafeAreaView style={{ flex: 1 }}>
					<Typography size='xxlarge' weight='bold'>
						No stores
					</Typography>

					<Spacer y={2} />

					<Typography variant='secondary'>
						You do not have access to any stores.
					</Typography>
				</SafeAreaView>
			</Screen>
		);
	}

	return (
		<Screen>
			<SafeAreaView style={{ flex: 1 }}>
				<Typography size='xxlarge' weight='bold'>
					{hasStores ? 'Select store' : 'Create a new store'}
				</Typography>

				<Spacer y={2} />

				<Typography variant='secondary'>
					{hasStores
						? 'Select the store you want to manage.'
						: 'Enter the details of your store to get started.'}
				</Typography>

				<Spacer y={16} />

				<StoreSelectList
					stores={data.stores}
					onAddStore={STORE_CREATION_ENABLED ? handleAddStore : undefined}
				/>
			</SafeAreaView>
		</Screen>
	);
};

export default StoreSelect;
