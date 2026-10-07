import { FormInput, ScrollableScreen, Spacer } from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';

import { useUpdateProductMutation } from '../data/mutations';
import useHeaderSubmit from '../hooks/useHeaderSubmit';
import type { AppStackScreenProps } from '../navigation/types';

const ProductDetails: React.FC<
	AppStackScreenProps<'Modal.EditProductDetails'>
> = ({ navigation, route }) => {
	const { params } = route;
	const updateProductMutation = useUpdateProductMutation();

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
			navigation.goBack();
		} catch (error) {
			console.error(error);
		}
	};

	useHeaderSubmit({
		onSubmit: methods.handleSubmit(onSubmit),
		loading: updateProductMutation.isPending
	});

	return (
		<ScrollableScreen withToolbar>
			<Spacer y={16} />
			<FormProvider {...methods}>
				<FormInput
					autoFocus
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
			</FormProvider>
		</ScrollableScreen>
	);
};

export default ProductDetails;
