import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../types/navigation';

interface FollowedStoresItemProps {
	store: any;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({ store }) => {
	const { navigate } = useNavigation<StackNavigationProp<MainStackParamList>>();

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={() => navigate('Store', { storeId: store.id })}
		>
			<View style={styles.imageContainer}>
				<View style={styles.placeholder}>
					<Image
						source={{ uri: store.store_avatar_images[0]?.image.path_url }}
						style={styles.image}
					/>
				</View>
			</View>
			<Text style={styles.name}>{store.name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 8
	},
	imageContainer: {
		width: 70,
		height: 70,
		borderColor: '#000000',
		borderWidth: 2,
		borderRadius: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	placeholder: {
		backgroundColor: '#D3D3D3',
		width: 60,
		height: 60,
		borderRadius: 40
	},
	name: {
		textAlign: 'center',
		marginTop: 4,
		fontSize: 14
	}
});

export default FollowedStoresItem;
