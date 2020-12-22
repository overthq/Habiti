import React from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	FlatList,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { items } from '../../api';

interface WatchlistItemProps {
	item: typeof items[-1];
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ item }) => {
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			style={styles.itemContainer}
			onPress={() => navigate('Item', { itemId: item.id })}
			activeOpacity={0.8}
		>
			<View style={styles.imagePlaceholder}>
				<Image
					source={{ uri: item.imageUrl }}
					style={{ width: '100%', height: '100%' }}
				/>
			</View>
			<Text style={{ fontSize: 16, fontWeight: '500' }} numberOfLines={1}>
				{item.name}
			</Text>
			<Text style={styles.itemPrice}>N{item.price}</Text>
			<Text style={{ fontSize: 14, color: '#7dba03', fontWeight: '500' }}>
				In Stock
			</Text>
		</TouchableOpacity>
	);
};

const Watchlist = () => (
	<View>
		<Text style={styles.sectionHeader}>Wishlist</Text>
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			data={items}
			renderItem={({ item }) => <WatchlistItem item={item} />}
			ListFooterComponent={<View style={{ width: 16 }} />}
		/>
	</View>
);

const styles = StyleSheet.create({
	sectionHeader: {
		fontWeight: 'bold',
		color: '#505050',
		fontSize: 18,
		marginVertical: 8,
		marginLeft: 16
	},
	itemContainer: {
		marginLeft: 16,
		width: 160
	},
	imagePlaceholder: {
		borderRadius: 6,
		backgroundColor: '#D3D3D3',
		width: 160,
		height: 160,
		marginBottom: 8,
		overflow: 'hidden'
	},
	itemPrice: {
		fontSize: 16,
		color: '#505050'
	}
});

export default Watchlist;
