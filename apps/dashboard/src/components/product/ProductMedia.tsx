import { Spacer, TextButton, Typography, useTheme } from '@habiti/components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ProductQuery } from '../../types/api';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { ProductStackParamList } from '../../types/navigation';

interface ProductMediaProps {
	images: ProductQuery['product']['images'];
	productId: string;
}

interface NoImagesProps {
	action(): void;
}

const NoImages: React.FC<NoImagesProps> = ({ action }) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6
			}}
		>
			<Typography weight='medium' size='large'>
				No images
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>Images will appear here.</Typography>
			<Spacer y={8} />
			<View style={{ backgroundColor: theme.border.color, height: 1 }} />
			<Spacer y={8} />
			<TextButton onPress={action}>Add image</TextButton>
		</View>
	);
};

const ProductMedia: React.FC<ProductMediaProps> = ({ images, productId }) => {
	const { navigate } = useNavigation<NavigationProp<ProductStackParamList>>();

	return (
		<View>
			<View style={styles.header}>
				<Typography weight='medium' size='large'>
					Media
				</Typography>
				<TextButton
					onPress={() => navigate('Product.Images', { productId, images })}
					size={15}
				>
					Manage
				</TextButton>
			</View>
			<Spacer y={8} />
			{images?.length === 0 ? (
				<NoImages
					action={() => navigate('Product.Images', { productId, images })}
				/>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingLeft: 16 }}
				>
					{images.map(image => (
						<Image
							key={image.id}
							source={{ uri: image.path }}
							style={styles.image}
						/>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginRight: 8
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16
	}
});

export default ProductMedia;
