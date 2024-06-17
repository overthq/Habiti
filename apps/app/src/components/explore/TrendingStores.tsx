import { ListEmpty, SectionHeader } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import TrendingStoresItem from './TrendingStoresItem';
import { useStoresQuery } from '../../types/api';
import { ExploreStackParamList } from '../../types/navigation';

const TrendingStores: React.FC = () => {
	const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation<NavigationProp<ExploreStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Store', { screen: 'Store.Main', params: { storeId } });
		},
		[]
	);

	if (!data?.stores) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<SectionHeader title='Trending Stores' />
			<FlashList
				horizontal
				data={data.stores}
				keyExtractor={item => item.id}
				estimatedItemSize={100}
				renderItem={({ item }) => (
					<TrendingStoresItem
						store={item}
						onPress={handleStorePress(item.id)}
					/>
				)}
				ListEmptyComponent={
					<ListEmpty
						title='No trending stores'
						description='There are no stores trending currently.'
					/>
				}
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 12
	}
});

export default TrendingStores;
