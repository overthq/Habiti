import { View } from 'react-native';
import { FormInput, Screen, Spacer, Button } from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useEditProductMutation } from '../types/api';
import { ProductStackParamList } from '../types/navigation';

const ProductDetails = () => {
	const { params } =
		useRoute<RouteProp<ProductStackParamList, 'Product.Details'>>();
	const [{ fetching }, editProduct] = useEditProductMutation();
	const { goBack } = useNavigation();

	useGoBack();

	const methods = useForm({
		defaultValues: {
			name: params.name,
			description: params.description
		}
	});

	const onSubmit = async (data: { name: string; description: string }) => {
		try {
			await editProduct({ id: params.productId, input: data });
			goBack();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Screen style={{ padding: 16 }}>
			<FormProvider {...methods}>
				<View>
					<FormInput
						label='Name'
						name='name'
						placeholder='Name'
						control={methods.control}
					/>
					<Spacer y={12} />
					<FormInput
						label='Description'
						name='description'
						placeholder='Description'
						control={methods.control}
						textArea
					/>
					<Spacer y={12} />
					<Button
						text='Save'
						loading={fetching}
						onPress={methods.handleSubmit(onSubmit)}
					/>
				</View>
			</FormProvider>
		</Screen>
	);
};

export default ProductDetails;
