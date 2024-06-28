import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator } from 'react-native';

import useGoBack from '../hooks/useGoBack';
import {
	CategoryQuery,
	useCategoryQuery,
	useEditProductCategoryMutation
} from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface EditCategoryFormValues {
	name: string;
	description: string;
}

interface EditCategoryMainProps {
	categoryId: string;
	data: CategoryQuery;
}

const EditCategoryMain: React.FC<EditCategoryMainProps> = ({
	categoryId,
	data
}) => {
	const { goBack } = useNavigation();
	const [{ fetching }, editCategory] = useEditProductCategoryMutation();

	const methods = useForm<EditCategoryFormValues>({
		defaultValues: {
			name: data.storeProductCategory?.name ?? '',
			description: data.storeProductCategory?.description ?? ''
		}
	});

	const onSubmit = async (values: EditCategoryFormValues) => {
		const { error } = await editCategory({ categoryId, input: values });

		if (error) {
			console.log(error);
		} else {
			goBack();
		}
	};

	return (
		<FormProvider {...methods}>
			<FormInput label='Name' name='name' control={methods.control} />
			<Spacer y={8} />
			<FormInput
				label='Description'
				name='description'
				control={methods.control}
				textArea
			/>
			<Spacer y={8} />
			<Button
				text='Edit profile'
				onPress={methods.handleSubmit(onSubmit)}
				loading={fetching}
			/>
		</FormProvider>
	);
};

const EditCategory = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modals.EditCategory'>>();
	const [{ data, fetching }] = useCategoryQuery({
		variables: { id: params.categoryId }
	});
	useGoBack('x');

	if (fetching || !data) {
		return <ActivityIndicator />;
	}

	return (
		<Screen style={{ padding: 16 }}>
			<EditCategoryMain categoryId={params.categoryId} data={data} />
		</Screen>
	);
};

export default EditCategory;
