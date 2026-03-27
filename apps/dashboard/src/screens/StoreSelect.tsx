import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Spacer, Typography } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StoreSelectList from '../components/store-select/StoreSelectList';

import { useManagedStoresQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';

const StoreSelect = () => {
	const { isLoading, data } = useManagedStoresQuery();
	const navigation =
		useNavigation<NativeStackNavigationProp<AppStackParamList>>();

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<Screen style={styles.container}>
			<SafeAreaView style={{ flex: 1 }}>
				<Typography size='xxlarge' weight='bold'>
					{data?.stores.length ? 'Select store' : 'Create a new store'}
				</Typography>

				<Spacer y={2} />

				<Typography variant='secondary'>
					{data?.stores.length
						? 'Select the store you want to manage.'
						: 'Enter the details of your store to get started.'}
				</Typography>

				<Spacer y={16} />

				<StoreSelectList
					stores={data?.stores}
					onAddStore={() => navigation.navigate('Modal.CreateStore')}
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
