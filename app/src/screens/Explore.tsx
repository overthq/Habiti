import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStoresQuery } from '../types';

const Explore = () => {
	const [{ data }] = useStoresQuery();

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<FlatList
					horizontal
					data={data?.stores}
					keyExtractor={({ _id }) => _id}
					renderItem={({ item }) => (
						<View key={item._id}>
							<Image
								source={{
									uri: `https://instagram.com/${item.instagramUsername}.png`
								}}
							/>
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
	}
});

export default Explore;
