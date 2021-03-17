import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useItemQuery } from '../types/api';
import { ItemsStackParamList } from '../types/navigation';
import { Icon } from '../components/icons';

const Item: React.FC = () => {
	const {
		params: { itemId }
	} = useRoute<RouteProp<ItemsStackParamList, 'Item'>>();
	const [{ data, fetching }] = useItemQuery({ variables: { itemId } });

	const item = data?.items_by_pk;

	if (fetching) return <ActivityIndicator />;
	if (!item) throw new Error('This item does not exist');

	return (
		<View style={styles.container}>
			<View style={styles.heading}>
				<Text style={styles.title}>{item.name}</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Images</Text>
				{item?.item_images.map(({ image }) => (
					<Image key={image.id} source={{ uri: image.path_url }} />
				))}
				<TouchableOpacity style={styles.addImageButton}>
					<Icon name='plus' size={24} />
				</TouchableOpacity>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Name</Text>
				<Text style={styles.text}>{item.name}</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Description</Text>
				<Text style={styles.text}>{item.description}</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Unit Price</Text>
				<Text style={styles.text}>{item.unit_price} NGN</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	heading: {
		marginVertical: 8,
		paddingLeft: 8
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	section: {
		padding: 8,
		backgroundColor: '#FFFFFF'
	},
	sectionTitle: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	addImageButton: {
		width: 80,
		height: 80,
		borderRadius: 6,
		borderColor: '#D3D3D3',
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 16
	}
});

export default Item;
