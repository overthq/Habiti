import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, Spacer, Typography } from '@habiti/components';

import CreateStoreForm from '../components/store-select/CreateStoreForm';
import StoreSelectList from '../components/store-select/StoreSelectList';
import { useManagedStoresQuery } from '../types/api';

const StoreSelect: React.FC = () => {
	const [{ fetching, data }] = useManagedStoresQuery();
	const [showCreateStore, setShowCreateStore] = React.useState(false);

	if (fetching || !data) {
		return <View />;
	}

	return (
		<Screen style={styles.container}>
			<SafeAreaView style={{ flex: 1 }}>
				<Typography size='xxlarge' weight='bold'>
					{data?.currentUser.managed.length
						? 'Select store'
						: 'Create a new store'}
				</Typography>

				<Spacer y={2} />

				<Typography variant='secondary'>
					{data?.currentUser.managed.length
						? 'Select the store you want to manage.'
						: 'Enter the details of your store to get started.'}
				</Typography>

				<Spacer y={16} />

				<Animated.View style={{ flex: 1 }}>
					{showCreateStore ? (
						<CreateStoreForm
							hasTitle={!!data?.currentUser.managed.length}
							onCancel={() => setShowCreateStore(false)}
						/>
					) : (
						<StoreSelectList
							stores={data?.currentUser.managed.map(({ store }) => store) ?? []}
							onAddStore={() => setShowCreateStore(true)}
						/>
					)}
				</Animated.View>
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
