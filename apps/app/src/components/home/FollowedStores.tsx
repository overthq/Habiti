import { Dialog, SectionHeader } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import FollowedStoresItem from './FollowedStoresItem';
import { HomeQuery } from '../../types/api';
import { HomeStackParamList } from '../../types/navigation';

interface FollowedStoresProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ followed }) => {
	return followed.length === 0 ? (
		<Dialog
			style={styles.dialog}
			title='No followed stores'
			description='Discover and follow more stores to improve your experience on the app.'
		/>
	) : (
		<View>
			<SectionHeader title='Followed stores' />
			<FollowedStoresMain followed={followed} />
		</View>
	);
};

interface FollowedStoresMainProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStoresMain: React.FC<FollowedStoresMainProps> = ({
	followed
}) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const handleStorePress = React.useCallback(
		(storeId: string) => () => {
			navigate('Home.Store', { screen: 'Store.Main', params: { storeId } });
		},
		[]
	);

	return (
		<FlashList
			horizontal
			data={followed}
			keyExtractor={item => item.store.id}
			contentContainerStyle={{ paddingLeft: 16 }}
			renderItem={({ item }) => (
				<FollowedStoresItem
					store={item.store}
					onPress={handleStorePress(item.store.id)}
				/>
			)}
			estimatedItemSize={108}
		/>
	);
};

const styles = StyleSheet.create({
	dialog: {
		marginHorizontal: 16
	}
});

export default FollowedStores;
