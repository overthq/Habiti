import { Spacer, TextButton, Typography, useTheme } from '@habiti/components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';
import { Image as ImageType } from '../../data/types';

interface ProductMediaProps {
	images: ImageType[];
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
				marginHorizontal: 16,
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
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();

	return (
		<View>
			<View style={styles.header}>
				<Typography weight='medium' size='large'>
					Media
				</Typography>
				<TextButton
					onPress={() =>
						navigate('Modal.EditProductImages', { productId, images })
					}
					size={15}
				>
					Manage
				</TextButton>
			</View>
			<Spacer y={8} />
			{images?.length === 0 ? (
				<NoImages
					action={() =>
						navigate('Modal.EditProductImages', { productId, images })
					}
				/>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={[{ paddingLeft: 16, gap: 8 }]}
				>
					{images.map(image => (
						<View
							key={image.id}
							style={[
								styles.imageContainer,
								{ borderColor: theme.border.color }
							]}
						>
							<Image
								source={{ uri: image.path.replace('http://', 'https://') }}
								style={styles.image}
							/>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		borderWidth: 1,
		borderRadius: 8,
		width: 100,
		height: 100,
		marginRight: 8,
		overflow: 'hidden'
	},
	image: {
		// width: '100%',
		// height: '100%'
		width: 100,
		height: 100
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16
	}
});

export default ProductMedia;
