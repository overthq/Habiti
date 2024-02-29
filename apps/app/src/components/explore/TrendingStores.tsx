import React from 'react';
import { View, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import textStyles from '../../styles/text';
import { useStoresQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';
import TrendingStoresItem from './TrendingStoresItem';

const TrendingStores: React.FC = () => {
	const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Store', { storeId });
		},
		[]
	);

	if (!data?.stores) {
		return <View />;
	}

	return (
		<View>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Trending Stores
			</Text>
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

export default TrendingStores;
