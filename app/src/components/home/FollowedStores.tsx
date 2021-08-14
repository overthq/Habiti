import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useStoresFollowedQuery } from '../../types/api';
import { useAppSelector } from '../../redux/store';
import { HomeTabParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';
import FollowedStoresItem from './FollowedStoresItem';

const FollowedStores: React.FC = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data, fetching }] = useStoresFollowedQuery({
		variables: { userId }
	});
	const { navigate } = useNavigation<StackNavigationProp<HomeTabParamList>>();

	if (fetching) {
		return (
			<View>
				<Text>Loading followed stores...</Text>
			</View>
		);
	}

	const stores = data?.store_followers.map(({ store }) => store);

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Stores you follow</Text>
			<FlatList
				horizontal
				data={stores}
				keyExtractor={item => item.id}
				style={styles.list}
				contentContainerStyle={styles.listContentContainer}
				renderItem={({ item }) => <FollowedStoresItem store={item} />}
				ListEmptyComponent={
					<ListEmpty
						title='No followed stores'
						description='You have not followed any stores yet. Follow some to view them here.'
						cta={{
							text: 'Discover new stores',
							action: () => navigate('Explore')
						}}
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// Fixed height: make sure that the container has the same height
		// in all states, i.e. when the list loading, when it's empty and when it's not.
	},
	sectionHeader: {
		marginLeft: 16,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	},
	list: { marginTop: 8 },
	listContentContainer: {
		marginRight: 8
	}
});

export default FollowedStores;
