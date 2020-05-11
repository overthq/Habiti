import React from 'react';
import { View, StyleSheet, FlatList, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStoresQuery } from '../types';

const Explore = () => {
	const [{ data }] = useStoresQuery();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Explore</Text>
			</View>
			<View>
				<FlatList
					horizontal
					data={data?.stores}
					keyExtractor={({ _id }) => _id}
					renderItem={({ item }) => (
						<View key={item._id} style={styles.storeImageContainer}>
							<Image
								source={{
									uri: `https://twitter.com/${item.twitterUsername}/profile_image?size=normal`
								}}
								style={{ height: 80, width: 80 }}
							/>
							<Text style={styles.storeName}>{item.name}</Text>
						</View>
					)}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
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
