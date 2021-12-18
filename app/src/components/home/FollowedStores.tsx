import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useStoresFollowedQuery } from '../../types/api';
import { HomeTabParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';
import FollowedStoresItem from './FollowedStoresItem';
import textStyles from '../../styles/text';

const FollowedStores: React.FC = () => {
	const [{ data, fetching }] = useStoresFollowedQuery();
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();

	if (fetching) {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
			</View>
		);
	}

	const stores = data?.currentUser.followed.map(({ store }) => store);

	if (!stores || stores?.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
					Followed Stores
				</Text>
				<ListEmpty
					title='No followed stores'
					description={`When you follow stores, you'll see updates from them here.`}
					cta={{
						text: 'Discover new stores',
						action: () => navigate('Explore')
					}}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
				Followed Stores
			</Text>
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
		height: 200
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
