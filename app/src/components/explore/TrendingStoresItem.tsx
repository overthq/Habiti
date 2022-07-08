import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StoresQuery } from '../../types/api';

interface TrendingStoresItemProps {
	store: StoresQuery['stores'][-1];
	onPress(): void;
}

const TrendingStoresItem: React.FC<TrendingStoresItemProps> = ({
	store,
	onPress
}) => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.container}
		onPress={onPress}
	>
		<View style={styles.placeholder}>
			<Image source={{ uri: store.image?.path }} style={styles.image} />
		</View>
		<Text style={styles.name}>{store.name}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		height: '100%',
		marginRight: 16
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%'
	},
	name: {
		fontWeight: '500',
		fontSize: 15,
		marginTop: 5,
		textAlign: 'center'
	}
});

export default TrendingStoresItem;
