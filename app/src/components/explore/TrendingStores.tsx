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
				horizontal
				data={data?.stores}
				keyExtractor={({ id }) => id}
				contentContainerStyle={styles.list}
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
	container: {},
	list: {
		paddingLeft: 20,
		height: 95
	},
	sectionHeader: {
		marginVertical: 5,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		paddingLeft: 20
	}
});

export default TrendingStores;
