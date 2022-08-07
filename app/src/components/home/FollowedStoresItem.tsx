import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../types/navigation';
import { StoresFollowedQuery } from '../../types/api';

interface FollowedStoresItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][-1]['store'];
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({ store }) => {
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={() => navigate('Store', { storeId: store.id })}
		>
			<View style={styles.placeholder}>
				{store.image && (
					<Image source={{ uri: store.image.path }} style={styles.image} />
				)}
			</View>
			<Text style={styles.name}>{store.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 8,
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
