import React from 'react';
import { View, Pressable, StyleSheet, FlatList } from 'react-native';
import { Avatar, SectionHeader, Spacer, Typography } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import type { TrendingStore } from '../../data/types';
import type { HomeStackParamList } from '../../navigation/types';

interface TrendingStoresProps {
	stores: TrendingStore[];
}

const TrendingStores: React.FC<TrendingStoresProps> = ({ stores }) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Home.Store', { storeId });
		},
		[navigate]
	);

	if (stores.length === 0) return null;

	return (
		<View>
			<SectionHeader title='Trending stores' padded={false} />

			<Spacer y={8} />

			<FlatList
				style={{ marginHorizontal: -16 }}
				horizontal
				showsHorizontalScrollIndicator={false}
				data={stores}
				keyExtractor={store => store.id}
				contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: 16 }}
				renderItem={({ item }) => (
					<TrendingStoresItem
						store={item}
						onPress={handleStorePress(item.id)}
					/>
				)}
			/>
		</View>
	);
};

interface TrendingStoresItemProps {
	store: TrendingStore;
	onPress(): void;
}

const TrendingStoresItem: React.FC<TrendingStoresItemProps> = ({
	store,
	onPress
}) => (
	<Pressable onPress={onPress} style={styles.item}>
		<Avatar
			uri={store.image?.path}
			size={72}
			fallbackText={store.name}
			circle
		/>

		<Spacer y={4} />

		<Typography
			size='small'
			weight='medium'
			numberOfLines={1}
			style={styles.name}
		>
			{store.name}
		</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	item: {
		width: 72
	},
	name: {
		textAlign: 'center'
	}
});

export default TrendingStores;
