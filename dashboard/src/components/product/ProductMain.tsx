import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import ProductForm from './ProductForm';
import type { ProductFormData } from '../../screens/AddProduct';
import { generateUploadFile } from '../../utils/images';
import TextButton from '../global/TextButton';

interface ProductMainProps {
	product: ProductQuery['product'];
}

const ProductMain: React.FC<ProductMainProps> = ({ product }) => {
	const navigation = useNavigation();
	const [toUpload, setToUpload] = React.useState<string[]>([]);
	const [{ fetching }, editProduct] = useEditProductMutation();

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: product.name,
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

		setToUpload([]);
	};

	React.useLayoutEffect(() => {
		const disabled = toUpload.length === 0 && !formMethods.formState.isDirty;

		navigation.setOptions({
			headerRight: () => {
				return (
					<View style={{ marginRight: 16 }}>
						{fetching ? (
							<ActivityIndicator />
						) : (
							<TextButton
								onPress={formMethods.handleSubmit(onSubmit)}
								disabled={disabled}
							>
								Save
							</TextButton>
						)}
					</View>
				);
			}
		});
	}, [toUpload, formMethods.formState.isDirty, fetching]);

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
