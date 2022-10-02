import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ReactNativeFile } from 'extract-files';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import ProductForm from './ProductForm';
import type { ProductFormData } from '../../screens/AddProduct';

interface ProductMainProps {
	product: ProductQuery['product'];
}

const ProductMain: React.FC<ProductMainProps> = ({ product }) => {
	const navigation = useNavigation();
	// Remember to ensure that some weird view caching does not allow this
	// to be shared between separate product screens.
	const [toUpload, setToUpload] = React.useState<ReactNativeFile[]>([]);
	const [, editProduct] = useEditProductMutation();

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: product?.name,
			description: product.description,
			unitPrice: String(product.unitPrice),
			quantity: String(product.quantity)
		}
	});

	const onSubmit = async (values: ProductFormData) => {
		editProduct({
			id: product.id,
			input: {
				...values,
				unitPrice: Number(values.unitPrice),
				quantity: Number(values.quantity)
			}
		});
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<Pressable
						style={{ marginRight: 16 }}
						onPress={formMethods.handleSubmit(onSubmit)}
					>
						<Text style={{ fontSize: 17 }}>Save</Text>
					</Pressable>
				);
			}
		});
	}, []);

	return (
		<FormProvider {...formMethods}>
			<ProductForm
				images={product.images}
				imagesToUpload={toUpload}
				setImagesToUpload={setToUpload}
			/>
		</FormProvider>
	);
};

export default ProductMain;
