import { Spacer, TextButton, Typography } from '@habiti/components';
import { Image, StyleSheet, View } from 'react-native';
import { ProductQuery } from '../../types/api';

interface ProductMediaProps {
	images: ProductQuery['product']['images'];
}

const ProductMedia: React.FC<ProductMediaProps> = ({ images }) => {
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
				<TextButton>Manage</TextButton>
			</View>
			<Spacer y={12} />
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
