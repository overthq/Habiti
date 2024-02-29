import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StoresFollowedQuery } from '../../types/api';

interface FollowedStoresItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][-1]['store'];
	onPress(): void;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({
	store,
	onPress
}) => {
	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={onPress}
		>
			<View style={styles.placeholder}>
				<Image source={{ uri: store.image?.path }} style={styles.image} />
			</View>
			<Text style={styles.name}>{store.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		marginRight: 16
	},
	image: {
		width: '100%',
		height: '100%'
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		width: 70,
		height: 70,
		borderRadius: 35
	},
	name: {
		textAlign: 'center',
		marginTop: 4,
		fontSize: 16
	}
});

export default FollowedStoresItem;
