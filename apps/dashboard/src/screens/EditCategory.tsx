import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';
import { useUpdateProductCategoryMutation } from '../data/mutations';
import { AppStackParamList } from '../types/navigation';

interface EditCategoryFormValues {
	name: string;
	description: string;
}

const EditCategory = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modals.EditCategory'>>();
	const { goBack } = useNavigation();
	const updateCategoryMutation = useUpdateProductCategoryMutation();
	useGoBack('x');

	const onSubmit = async (values: EditCategoryFormValues) => {
		await updateCategoryMutation.mutateAsync({
			categoryId: params.categoryId,
			body: values
		});

		goBack();
	};

	const methods = useForm<EditCategoryFormValues>({
		defaultValues: {
			name: params.name,
			description: params.description
		}
	});

	return (
		<Screen style={{ padding: 16 }}>
			<FormProvider {...methods}>
				<FormInput label='Name' name='name' control={methods.control} />
				<Spacer y={8} />
				<FormInput
					label='Description'
					name='description'
					placeholder='Describe your category'
					control={methods.control}
					textArea
				/>
				<Spacer y={16} />
				<Button
					text='Edit Category'
					onPress={methods.handleSubmit(onSubmit)}
					loading={updateCategoryMutation.isPending}
				/>
			</FormProvider>
		</Screen>
	);
};

export default EditCategory;
