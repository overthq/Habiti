import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';
import { useEditProductCategoryMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface EditCategoryFormValues {
	name: string;
	description: string;
}

const EditCategory = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modals.EditCategory'>>();
	const { goBack } = useNavigation();
	const [{ fetching }, editCategory] = useEditProductCategoryMutation();
	useGoBack('x');

	const onSubmit = async (values: EditCategoryFormValues) => {
		const { error } = await editCategory({
			categoryId: params.categoryId,
			input: values
		});

		if (error) {
			console.log(error);
		} else {
			goBack();
		}
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
					loading={fetching}
				/>
			</FormProvider>
		</Screen>
	);
};

export default EditCategory;
