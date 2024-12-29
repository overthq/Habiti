import { ScrollableScreen, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CreateStoreForm from '../components/store-select/CreateStoreForm';
import StoreSelectList from '../components/store-select/StoreSelectList';
import { useManagedStoresQuery } from '../types/api';

const StoreSelect: React.FC = () => {
	const [{ fetching, data }] = useManagedStoresQuery();

	if (fetching || !data) {
		return <View />;
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollableScreen style={styles.container}>
				<Typography size='xxxlarge' weight='bold'>
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

				<StoreSelectList
					stores={data?.currentUser.managed.map(({ store }) => store) ?? []}
				/>

				{data?.currentUser.managed.length ? (
					<View>
						<Typography
							variant='secondary'
							style={{ marginVertical: 4, textAlign: 'center' }}
						>
							OR
						</Typography>
						<Spacer y={2} />
						<Typography size='large' weight='bold'>
							Create a new store
						</Typography>
						<Spacer y={8} />
					</View>
				) : null}

				<CreateStoreForm />
			</ScrollableScreen>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingTop: 32
	}
});

export default StoreSelect;
