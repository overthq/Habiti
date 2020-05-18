import React from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStoresQuery } from '../types';
import { Icon } from '../components/icons';

const { width } = Dimensions.get('window');

const Explore = () => {
	const [{ data }] = useStoresQuery();
	const { navigate } = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Explore</Text>
			</View>
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.searchBar}
				onPress={() => navigate('Search')}
			>
				<Icon name='search' color='#505050' size={20} />
				<Text style={{ fontSize: 16, paddingLeft: 5, color: '#777777' }}>
					Search stores and items
				</Text>
			</TouchableOpacity>
			<View style={{ marginTop: 16 }}>
				<FlatList
					horizontal
					data={data?.stores}
					keyExtractor={({ _id }) => _id}
					contentContainerStyle={{ paddingLeft: 20 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							key={item._id}
							style={styles.featuredStoreContainer}
							onPress={() => navigate('Store', { storeId: item._id })}
						>
							<Image
								source={{
									uri: `https://twitter.com/${item.twitterUsername}/profile_image?size=normal`
								}}
								style={{ height: 80, width: 80 }}
							/>
							{/* <Text style={styles.storeName}>{item.name}</Text> */}
						</TouchableOpacity>
					)}
					ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
	searchBar: {
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		flexDirection: 'row',
		padding: 10,
		width: width - 40,
		height: 40
	},
	featuredStoreContainer: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storeImageContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginLeft: 20
	},
	storeName: {
		fontWeight: '500',
		fontSize: 15
	}
});

export default Explore;
