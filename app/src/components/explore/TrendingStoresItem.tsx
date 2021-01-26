import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface TrendingStoresItemProps {
	store: any;
}

const TrendingStoresItem: React.FC<TrendingStoresItemProps> = ({ store }) => {
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.storeWrapper}
			onPress={() => navigate('Store', { storeId: store.id })}
		>
			<View style={styles.storeContainer}>
				<Image source={{ uri: store.avatarUrl }} style={styles.storeImage} />
			</View>
			<Text style={styles.storeName}>{store.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	storeWrapper: {
		justifyContent: 'center',
		height: '100%',
		marginRight: 16 // Line 17 (in TrendingStores.tsx)?
	},
	storeContainer: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	storeImage: {
		height: 70,
		width: 70,
		borderRadius: 35
	},
	storeName: {
		fontWeight: '500',
		fontSize: 15,
		marginTop: 5,
		textAlign: 'center'
	}
});

export default TrendingStoresItem;
