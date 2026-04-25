import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Screen, Spacer, Typography } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StoreSelectList from '../components/store-select/StoreSelectList';

import { useManagedStoresQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';
import { STORE_CREATION_ENABLED } from '../utils/constants';
import env from '../../env';

const StoreSelect = () => {
	const { isLoading, data } = useManagedStoresQuery();
	const navigation =
		useNavigation<NativeStackNavigationProp<AppStackParamList>>();

	if (isLoading || !data) {
		return <View />;
	}

	const hasStores = data.stores.length > 0;
	const sellUrl = `${env.webFrontendUrl}/sell`;

	const handleOpenSellWeb = React.useCallback(() => {
		Linking.openURL(sellUrl);
	}, [sellUrl]);

	const handleAddStore = React.useCallback(() => {
		navigation.navigate('Modal.CreateStore');
	}, [navigation]);

	if (!STORE_CREATION_ENABLED && !hasStores) {
		return (
			<Screen style={styles.container}>
				<SafeAreaView style={{ flex: 1 }}>
					<Typography size='xxlarge' weight='bold'>
						Create a new store
					</Typography>

					<Spacer y={2} />

					<Typography variant='secondary'>
						Store creation has moved to the web. Visit habiti.com/sell to set up
						your store, then come back here to manage it.
					</Typography>

					<Spacer y={24} />

					<Button text='Open habiti.com/sell' onPress={handleOpenSellWeb} />
				</SafeAreaView>
			</Screen>
		);
	}

	return (
		<Screen style={styles.container}>
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

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 16
	}
});

export default StoreSelect;
