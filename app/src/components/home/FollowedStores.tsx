import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useStoresFollowedQuery } from '../../types/api';
import { useAppSelector } from '../../redux/store';
import { HomeTabParamList, MainStackParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';

const FollowedStores: React.FC = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data, fetching }] = useStoresFollowedQuery({
		variables: { userId }
	});
	const { navigate } =
		useNavigation<StackNavigationProp<MainStackParamList & HomeTabParamList>>();

	if (fetching) {
		return (
			<View>
				<Text>Loading followed stores...</Text>
			</View>
		);
	}

	const stores = data?.store_followers.map(({ store }) => store);

	return (
		<View>
			<Text style={styles.sectionHeader}>New Arrivals</Text>
			<FlatList
				horizontal
				data={stores}
				keyExtractor={item => item.id}
				style={{ marginTop: 8 }}
				contentContainerStyle={{ paddingLeft: 16 }}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.storyContainer}
						activeOpacity={0.8}
						onPress={() => navigate('Store', { storeId: item.id })}
					>
						<View style={styles.storyImageContainer}>
							<View style={styles.storyImagePlaceholder} />
						</View>
						<Text style={styles.storeName}>{item.name}</Text>
					</TouchableOpacity>
				)}
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
	sectionHeader: {
		marginLeft: 16,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
	},
	storyContainer: {
		marginHorizontal: 8
	},
	storyImageContainer: {
		width: 70,
		height: 70,
		borderColor: '#000000',
		borderWidth: 2,
		borderRadius: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storyImagePlaceholder: {
		backgroundColor: '#D3D3D3',
		width: 60,
		height: 60,
		borderRadius: 40
	},
	storeName: {
		textAlign: 'center',
		marginTop: 4,
		fontSize: 16
	}
});

export default FollowedStores;
