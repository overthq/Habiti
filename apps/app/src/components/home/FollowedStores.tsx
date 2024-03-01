import { ListEmpty, Typography } from '@market/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import FollowedStoresItem from './FollowedStoresItem';
import { HomeQuery } from '../../types/api';
import { AppStackParamList, HomeTabParamList } from '../../types/navigation';

interface FollowedStoresProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ followed }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const navigation = useNavigation<NavigationProp<HomeTabParamList>>();

	const stores = React.useMemo(
		() => followed.map(({ store }) => store),
		[followed]
	);

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Store', { storeId });
		},
		[]
	);

	if (!stores || stores?.length === 0) {
		return (
			<View>
				<Typography weight='medium' style={{ marginLeft: 16, marginBottom: 8 }}>
					Followed Stores
				</Typography>
				<ListEmpty
					description={`When you follow stores, you'll see updates from them here.`}
					cta={{
						text: 'Discover new stores',
						action: () => navigation.navigate('Explore')
					}}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Typography weight='medium' style={{ marginLeft: 16, marginBottom: 8 }}>
				Followed Stores
			</Typography>
			<FlashList
				horizontal
				data={stores}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<FollowedStoresItem
						store={item}
						onPress={handleStorePress(item.id)}
					/>
				)}
				estimatedItemSize={100}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	}
});

export default FollowedStores;
