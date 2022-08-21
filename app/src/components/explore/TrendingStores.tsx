import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import textStyles from '../../styles/text';
import { useStoresQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';
import TrendingStoresItem from './TrendingStoresItem';
import { FlashList } from '@shopify/flash-list';

const TrendingStores: React.FC = () => {
	const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Store', { storeId });
		},
		[]
	);

	return (
		<View style={styles.container}>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Trending Stores
			</Text>
			<FlashList
				data={data?.stores}
				keyExtractor={({ id }) => id}
				contentContainerStyle={styles.list}
				estimatedItemSize={70}
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
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 500
	},
	list: {
		paddingLeft: 16
	}
});

export default TrendingStores;
