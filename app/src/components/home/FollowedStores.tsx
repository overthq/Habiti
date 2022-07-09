import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HomeQuery } from '../../types/api';
import { HomeTabParamList } from '../../types/navigation';
import ListEmpty from '../global/ListEmpty';
import FollowedStoresItem from './FollowedStoresItem';
import textStyles from '../../styles/text';

interface FollowedStoresProps {
	followed: HomeQuery['currentUser']['followed'];
}

const FollowedStores: React.FC<FollowedStoresProps> = ({ followed }) => {
	const { navigate } = useNavigation<NavigationProp<HomeTabParamList>>();

	const stores = React.useMemo(
		() => followed.map(({ store }) => store),
		[followed]
	);

	if (!stores || stores?.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={[textStyles.sectionHeader, { marginLeft: 16 }]}>
					Followed Stores
				</Text>
				<ListEmpty
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
	container: {},
	listContentContainer: {
		marginRight: 8
	}
});

export default FollowedStores;
