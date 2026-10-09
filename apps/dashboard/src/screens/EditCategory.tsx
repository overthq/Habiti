import { FormInput, ScrollableScreen, Spacer } from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';

import { useUpdateProductCategoryMutation } from '../data/mutations';
import useHeaderSubmit from '../hooks/useHeaderSubmit';
import type { AppStackScreenProps } from '../navigation/types';

interface EditCategoryFormValues {
	name: string;
	description: string;
}

const EditCategory: React.FC<AppStackScreenProps<'Modal.EditCategory'>> = ({
	navigation,
	route
}) => {
	const { params } = route;
	const updateCategoryMutation = useUpdateProductCategoryMutation();

	const onSubmit = async (values: EditCategoryFormValues) => {
		await updateCategoryMutation.mutateAsync({
			categoryId: params.categoryId,
			body: values
		});

		navigation.goBack();
	};

	const methods = useForm<EditCategoryFormValues>({
		defaultValues: {
			name: params.name,
			description: params.description
		}
	});

	useHeaderSubmit({
		onSubmit: methods.handleSubmit(onSubmit),
		loading: updateCategoryMutation.isPending
	});

	return (
		<ScrollableScreen withToolbar>
			<Spacer y={16} />
			<FormProvider {...methods}>
				<FormInput
					autoFocus
					label='Name'
					name='name'
					control={methods.control}
				/>
				<Spacer y={8} />
				<FormInput
					label='Description'
					name='description'
					placeholder='Describe your category'
					control={methods.control}
					textArea
				/>
			</FormProvider>
		</ScrollableScreen>
	);
};

export default EditCategory;
