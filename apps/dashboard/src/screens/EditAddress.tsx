import { Button, FormInput, Screen, Spacer } from '@habiti/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';
import { useUpdateAddressMutation } from '../data/mutations';
import { AppStackParamList } from '../navigation/types';

interface EditAddressFormValues {
	name: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	country: string;
	postcode: string;
}

const EditAddress = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modal.EditAddress'>>();
	const { goBack } = useNavigation();
	const updateAddressMutation = useUpdateAddressMutation();
	useGoBack('x');

	const onSubmit = async (values: EditAddressFormValues) => {
		const { line2, postcode, ...rest } = values;
		await updateAddressMutation.mutateAsync({
			addressId: params.addressId,
			body: {
				...rest,
				...(line2 ? { line2 } : {}),
				...(postcode ? { postcode } : {})
			}
		});

		goBack();
	};

	const methods = useForm<EditAddressFormValues>({
		defaultValues: {
			name: params.name,
			line1: params.line1,
			line2: params.line2 ?? '',
			city: params.city,
			state: params.state,
			country: params.country,
			postcode: params.postcode ?? ''
		}
	});

	return (
		<Screen style={{ padding: 16 }}>
			<FormProvider {...methods}>
				<FormInput label='Name' name='name' control={methods.control} />
				<Spacer y={8} />
				<FormInput
					label='Address line 1'
					name='line1'
					control={methods.control}
				/>
				<Spacer y={8} />
				<FormInput
					label='Address line 2'
					name='line2'
					control={methods.control}
				/>
				<Spacer y={8} />
				<FormInput label='City' name='city' control={methods.control} />
				<Spacer y={8} />
				<FormInput label='State' name='state' control={methods.control} />
				<Spacer y={8} />
				<FormInput label='Country' name='country' control={methods.control} />
				<Spacer y={8} />
				<FormInput label='Postcode' name='postcode' control={methods.control} />
				<Spacer y={16} />
				<Button
					text='Edit Address'
					onPress={methods.handleSubmit(onSubmit)}
					loading={updateAddressMutation.isPending}
				/>
			</FormProvider>
		</Screen>
	);
};

export default EditAddress;
