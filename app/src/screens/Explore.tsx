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
				<Text style={styles.sectionHeader}>Trending Stores</Text>
				<FlatList
					horizontal
					data={data?.stores}
					keyExtractor={({ id }) => id}
					contentContainerStyle={{ paddingLeft: 20, height: 100 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{ justifyContent: 'center', height: '100%' }}
							onPress={() => navigate('Store', { storeId: item.id })}
						>
							<View key={item.id} style={styles.featuredStoreContainer}>
								<Image
									source={{
										uri: `https://twitter.com/${item.profile.twitter_username}/profile_image?size=normal`
									}}
									style={{ height: 80, width: 80 }}
								/>
							</View>
							<Text style={styles.storeName}>{item.name}</Text>
						</TouchableOpacity>
					)}
					ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
				/>
			</View>
			<View
				style={{
					height: 250,
					margin: 20,
					borderRadius: 8,
					backgroundColor: '#D3D3D3',
					padding: 20
				}}
			>
				<Text>Item of the day</Text>
			</View>
			<View style={{ marginTop: 16 }}>
				<Text style={styles.sectionHeader}>Featured Items</Text>
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
	sectionHeader: {
		marginVertical: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#505050',
		paddingLeft: 20
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
		fontSize: 15,
		marginTop: 5,
		textAlign: 'center'
	}
});

export default Explore;
