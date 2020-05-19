import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreQuery, useStoreItemsQuery } from '../types';

const StoreItems: React.FC<{ storeId: string }> = ({ storeId }) => {
	const [{ data, fetching }] = useStoreItemsQuery({ variables: { storeId } });

	if (fetching) {
		return <ActivityIndicator />;
	}

	return (
		<FlatList
			data={data?.storeItems}
			renderItem={({ item }) => (
				<View key={item._id}>
					<View
						style={{
							height: 200,
							width: 120,
							backgroundColor: '#D3D3D3',
							borderRadius: 8
						}}
					/>
					<Text>{item.name}</Text>
				</View>
			)}
			numColumns={2}
		/>
	);
};

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params?.storeId }
	});

	React.useLayoutEffect(() => {
		setOptions({ title: data?.store.name });
	}, [data]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<View></View>
			<StoreItems storeId={data?.store._id} />
		</SafeAreaView>
	);
};

export default Store;
