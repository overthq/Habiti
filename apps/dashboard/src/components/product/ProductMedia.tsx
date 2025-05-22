import { Spacer, TextButton, Typography } from '@habiti/components';
import { Image, StyleSheet, View } from 'react-native';
import { ProductQuery } from '../../types/api';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { ProductStackParamList } from '../../types/navigation';

interface ProductMediaProps {
	images: ProductQuery['product']['images'];
	productId: string;
}

const ProductMedia: React.FC<ProductMediaProps> = ({ images, productId }) => {
	const { navigate } = useNavigation<NavigationProp<ProductStackParamList>>();

	return (
		<View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Typography weight='medium' size='large'>
					Images
				</Typography>
				<TextButton
					weight='medium'
					onPress={() => navigate('Product.Images', { productId, images })}
				>
					Manage
				</TextButton>
			</View>
			<Spacer y={8} />
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
				{images.map(image => (
					<Image
						key={image.id}
						source={{ uri: image.path }}
						style={styles.image}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
		borderRadius: 8
	}
});

export default ProductMedia;
