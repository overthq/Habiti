import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useStoresFollowedQuery } from '../../types';

const FollowedStores = () => {
	const [{ data }] = useStoresFollowedQuery();

	return (
		<View>
			<Text style={styles.sectionHeader}>New Arrivals</Text>
			<FlatList
				horizontal
				data={data?.storesFollowed}
				keyExtractor={item => item.store_id}
				style={{ marginTop: 10 }}
				contentContainerStyle={{ paddingLeft: 20 }}
				renderItem={({ item }) => (
					<TouchableOpacity activeOpacity={0.8}>
						<View style={styles.storyImageContainer}>
							<View style={styles.storyImagePlaceholder} />
						</View>
						<Text style={styles.storeName}>{item.store.name}</Text>
					</TouchableOpacity>
				)}
				ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		marginLeft: 20,
		fontSize: 18,
		fontWeight: '500',
		color: '#505050'
	},
	storyImageContainer: {
		width: 90,
		height: 90,
		borderColor: '#000000',
		borderWidth: 2,
		borderRadius: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storyImagePlaceholder: {
		backgroundColor: '#D3D3D3',
		width: 80,
		height: 80,
		borderRadius: 40
	},
	storeName: {
		textAlign: 'center',
		marginTop: 5,
		fontSize: 16
	}
});

export default FollowedStores;
