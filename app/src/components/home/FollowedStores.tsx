import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStoresFollowedQuery } from '../../types/api';

const FollowedStores = () => {
	const [{ data }] = useStoresFollowedQuery({
		variables: { userId: 'b6cc8a11-7528-41eb-b082-77593797c978' }
	});
	const { navigate } = useNavigation();

	return (
		<View>
			<Text style={styles.sectionHeader}>New Arrivals</Text>
			<FlatList
				horizontal
				data={data?.store_followers}
				keyExtractor={item => item.store_id}
				style={{ marginTop: 10 }}
				contentContainerStyle={{ paddingLeft: 20 }}
				renderItem={({ item }) => (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => navigate('Store', { storeId: item.store_id })}
					>
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
		fontSize: 16,
		fontWeight: '500',
		color: '#505050'
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
		marginTop: 5,
		fontSize: 16
	}
});

export default FollowedStores;
