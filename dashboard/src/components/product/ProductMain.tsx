import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import ProductForm from './ProductForm';
import type { ProductFormData } from '../../screens/AddProduct';
import { generateUploadFile } from '../../utils/images';

interface ProductMainProps {
	product: ProductQuery['product'];
}

const ProductMain: React.FC<ProductMainProps> = ({ product }) => {
	const navigation = useNavigation();
	const [toUpload, setToUpload] = React.useState<string[]>([]);
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
		await editProduct({
			id: product.id,
			input: {
				...values,
				unitPrice: Number(values.unitPrice),
				quantity: Number(values.quantity),
				imageFiles: toUpload.map(generateUploadFile)
			}
		});
	};

	React.useLayoutEffect(() => {
		const disabled = toUpload.length === 0 && !formMethods.formState.isDirty;

		navigation.setOptions({
			headerRight: () => {
				return (
					<Pressable
						style={{ marginRight: 16 }}
						onPress={formMethods.handleSubmit(onSubmit)}
						disabled={disabled}
					>
						<Text
							style={[{ fontSize: 17 }, disabled ? { color: '#777777' } : {}]}
						>
							Save
						</Text>
					</Pressable>
				);
			}
		});
	}, [toUpload]);

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
