import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import { useEditProductMutation, useProductQuery } from '../types/api';
import { ProductsStackParamList } from '../types/navigation';
import ProductForm from '../components/product/ProductForm';
import { ReactNativeFile } from 'extract-files';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductFormData } from './AddProduct';
import useGoBack from '../hooks/useGoBack';

// TODO:
// - Set up "collections/groups" for products.
// - We can display this somehow on the store screen for shoppers.

// We need to have a detailed way of knowing if the values have changed from the default,
// for any of the many items on the list here.
// This might be very wasteful w.r.t. render computations, since we'd ideally
// have to check this on every re-render that relates to value changes.

const Product: React.FC = () => {
	const navigation = useNavigation();
	const {
		params: { productId }
	} = useRoute<RouteProp<ProductsStackParamList, 'Product'>>();

	const [{ data, fetching }] = useProductQuery({
		variables: { id: productId }
	});

	const [, editProduct] = useEditProductMutation();

	// Remember to replace this with a better-looking back button.
	// (Preferably the native default, but black).
	useGoBack();

	// Remember to ensure that some weird view caching does not allow this
	// to be shared between separate product screens.

	const [toUpload, setToUpload] = React.useState<ReactNativeFile[]>([]);

	const formMethods = useForm<ProductFormData>({
		defaultValues: {
			name: data?.product?.name ?? '',
			description: data?.product.description ?? '',
			unitPrice: String(data?.product.unitPrice ?? ''),
			quantity: String(data?.product.quantity ?? '')
		}
	});

	const onSubmit = async (values: ProductFormData) => {
		editProduct({
			id: productId,
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

	if (fetching || !data?.product) return <ActivityIndicator />;

	return (
		<FormProvider {...formMethods}>
			<ProductForm
				images={data.product.images}
				imagesToUpload={toUpload}
				setImagesToUpload={setToUpload}
			/>
		</FormProvider>
	);
};

export default Product;
