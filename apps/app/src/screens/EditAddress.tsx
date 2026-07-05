import React from 'react';
import {
	Button,
	FormInput,
	ScrollableScreen,
	Spacer
} from '@habiti/components';
import { FormProvider, useForm } from 'react-hook-form';

import { useUpdateDeliveryAddressMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';

interface EditAddressFormValues {
	name: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	country: string;
	postcode: string;
}

const EditAddress: React.FC<AppStackScreenProps<'Modal.EditAddress'>> = ({
	navigation,
	route
}) => {
	const { params } = route;
	const updateDeliveryAddress = useUpdateDeliveryAddressMutation();

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

	const onSubmit = async (values: EditAddressFormValues) => {
		const { line2, postcode, ...rest } = values;
		await updateDeliveryAddress.mutateAsync({
			addressId: params.addressId,
			body: {
				...rest,
				...(line2 ? { line2 } : {}),
				...(postcode ? { postcode } : {})
			}
		});

		navigation.goBack();
	};

	return (
		<ScrollableScreen>
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
					text='Save Address'
					onPress={methods.handleSubmit(onSubmit)}
					loading={updateDeliveryAddress.isPending}
				/>
			</FormProvider>
		</ScrollableScreen>
	);
};

export default EditAddress;
