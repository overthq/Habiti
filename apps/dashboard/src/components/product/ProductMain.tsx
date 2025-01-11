import { Icon, TextButton } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import ProductForm from './ProductForm';
import type { ProductFormData } from '../../screens/AddProduct';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import { generateUploadFile } from '../../utils/images';
import ProductSettings from './ProductSettings';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ProductMainProps {
	product: ProductQuery['product'];
	mode: 'add' | 'edit';
}

const ProductMain: React.FC<ProductMainProps> = ({ product, mode }) => {
	const navigation = useNavigation();
	const [toUpload, setToUpload] = React.useState<string[]>([]);
	const [{ fetching }, editProduct] = useEditProductMutation();
	const settingsModalRef = React.useRef<BottomSheetModal>(null);

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: product.name,
			description: product.description,
			unitPrice: String(product.unitPrice),
			quantity: String(product.quantity),
			categories: product.categories.map(({ category }) => category.id)
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
			console.log(`Error while editing product:\n${error}`);
		} else {
			setToUpload([]);
		}
	};

	React.useLayoutEffect(() => {
		const disabled = toUpload.length === 0 && !formMethods.formState.isDirty;

		navigation.setOptions({
			headerRight: () => {
				return (
					<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
						<TextButton
							onPress={formMethods.handleSubmit(onSubmit)}
							disabled={disabled || fetching}
						>
							Save
						</TextButton>
						<Pressable
							onPress={() => {
								settingsModalRef.current?.present();
							}}
						>
							<Icon name='more-horizontal' size={20} />
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
				categories={product.categories}
				imagesToUpload={toUpload}
				setImagesToUpload={setToUpload}
				mode={mode}
			/>
			<ProductSettings productId={product.id} modalRef={settingsModalRef} />
		</FormProvider>
	);
};

export default ProductMain;
