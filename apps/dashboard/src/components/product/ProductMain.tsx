import { Icon, TextButton } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import ProductForm from './ProductForm';
import type { ProductFormData } from '../../screens/AddProduct';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import { generateUploadFile } from '../../utils/images';

interface ProductMainProps {
	product: ProductQuery['product'];
	mode: 'add' | 'edit';
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
		const { error } = await editProduct({
			id: product.id,
			input: {
				...values,
				unitPrice: Number(values.unitPrice),
				quantity: Number(values.quantity),
				imageFiles: toUpload.map(generateUploadFile)
			}
		});

		if (error) {
			console.log('Error while editing product: ');
			console.log(error);
		} else {
			setToUpload([]);
		}
	};

	React.useLayoutEffect(() => {
		const disabled = toUpload.length === 0 && !formMethods.formState.isDirty;

		navigation.setOptions({
			headerRight: () => {
				return (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TextButton
							onPress={formMethods.handleSubmit(onSubmit)}
							disabled={disabled || fetching}
							style={{ marginRight: 12 }}
						>
							Save
						</TextButton>
						<Pressable>
							<Icon name='more-horizontal' />
						</Pressable>
					</View>
				);
			}
		});
	}, [toUpload, formMethods.formState.isDirty, fetching]);

	return (
		<FormProvider {...formMethods}>
			<ProductForm
				images={product.images}
				options={product.options}
				imagesToUpload={toUpload}
				setImagesToUpload={setToUpload}
			/>
		</FormProvider>
	);
};

export default ProductMain;
