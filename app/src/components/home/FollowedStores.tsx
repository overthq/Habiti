import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
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
		variables: { userId: userId as string }
	});
	const { navigate } = useNavigation<StackNavigationProp<HomeTabParamList>>();

	if (fetching) {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
			</View>
		);
	}

	const stores = data?.user.followed.map(({ store }) => store);

	if (!stores || stores?.length === 0) {
		return (
			<ListEmpty
				title='No followed stores'
				description={`When you follow stores, you'll see updates from them here.`}
				cta={{
					text: 'Discover new stores',
					action: () => navigate('Explore')
				}}
			/>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Stores you follow</Text>
			<FlatList
				style={styles.list}
				horizontal
				data={stores}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContentContainer}
				renderItem={({ item }) => <FollowedStoresItem store={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 500
	},
	list: {
		marginTop: 8,
		height: '100%'
	},
	sectionHeader: {
		marginLeft: 16,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	},
	listContentContainer: {
		marginRight: 8
	}
});

export default FollowedStores;
