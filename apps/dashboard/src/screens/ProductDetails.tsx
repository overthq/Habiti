import {
	FormInput,
	ScrollableScreen,
	Spacer,
	Button
} from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { useUpdateProductMutation } from '../data/mutations';
import { AppStackParamList } from '../navigation/types';

const ProductDetails = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modal.EditProductDetails'>>();
	const updateProductMutation = useUpdateProductMutation();
	const { goBack } = useNavigation();

	const methods = useForm({
		defaultValues: {
			name: params.name,
			description: params.description
		}
	});

	const onSubmit = async (data: { name: string; description: string }) => {
		try {
			await updateProductMutation.mutateAsync({
				productId: params.productId,
				body: data
			});
			goBack();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ScrollableScreen style={{ padding: 16 }}>
			<FormProvider {...methods}>
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
					loading={updateProductMutation.isPending}
					onPress={methods.handleSubmit(onSubmit)}
				/>
			</FormProvider>
		</ScrollableScreen>
	);
};

export default ProductDetails;
