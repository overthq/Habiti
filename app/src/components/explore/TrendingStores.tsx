import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ListEmpty from '../global/ListEmpty';
import { stores } from '../../api';

const TrendingStores: React.FC = () => {
	const { navigate } = useNavigation();

	return (
		<View style={{ marginTop: 8 }}>
			<Text style={styles.sectionHeader}>Trending Stores</Text>
			<FlatList
				horizontal
				data={stores}
				keyExtractor={({ id }) => id}
				contentContainerStyle={{ paddingLeft: 20, height: 95 }}
				renderItem={({ item }) => (
					<TouchableOpacity
						activeOpacity={0.8}
						style={{ justifyContent: 'center', height: '100%' }}
						onPress={() => navigate('Store', { storeId: item.id })}
					>
						<View key={item.id} style={styles.featuredStoreContainer}>
							<Image
								source={{ uri: item.avatarUrl }}
								style={{ height: 70, width: 70, borderRadius: 35 }}
							/>
						</View>
						<Text style={styles.storeName}>{item.name}</Text>
					</TouchableOpacity>
				)}
				ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
				ListEmptyComponent={
					<ListEmpty
						title='No trending stores'
						description='There are no stores trending currently.'
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	featuredStoreContainer: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storeName: {
		fontWeight: '500',
		fontSize: 15,
		marginTop: 5,
		textAlign: 'center'
	},
	sectionHeader: {
		marginVertical: 5,
		fontSize: 16,
		fontWeight: '500',
		color: '#505050',
		paddingLeft: 20
	}
});

export default TrendingStores;
