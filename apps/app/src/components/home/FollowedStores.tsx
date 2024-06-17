import { Dialog, SectionHeader } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import FollowedStoresItem from './FollowedStoresItem';
import { HomeQuery } from '../../types/api';
import { HomeStackParamList, HomeTabParamList } from '../../types/navigation';

interface FollowedStoresProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ followed }) => {
	return (
		<View style={styles.container}>
			{followed.length === 0 ? (
				<Dialog
					style={styles.dialog}
					title='No followed stores'
					description='Discover and follow more stores to improve your experience on the app.'
				/>
			) : (
				<>
					<SectionHeader title='Followed stores' />
					<FollowedStoresMain followed={followed} />
				</>
			)}
		</View>
	);
};

interface FollowedStoresMainProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStoresMain: React.FC<FollowedStoresMainProps> = ({
	followed
}) => {
	const { navigate } =
		useNavigation<NavigationProp<HomeStackParamList & HomeTabParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Store', { screen: 'Store.Main', params: { storeId } });
		},
		[]
	);

	const stores = React.useMemo(
		() => followed.map(({ store }) => store),
		[followed]
	);

	return (
		<FlashList
			horizontal
			data={stores}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<FollowedStoresItem store={item} onPress={handleStorePress(item.id)} />
			)}
			estimatedItemSize={108}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		// paddingTop: 16
	},
	dialog: {
		marginHorizontal: 16
	}
});

export default FollowedStores;
