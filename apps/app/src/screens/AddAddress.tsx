import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, FormInput, ScrollableScreen } from '@habiti/components';

import { useAddDeliveryAddressMutation } from '../data/mutations';

interface AddAddressValues {
	name: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	country: string;
	postcode: string;
}

const AddAddress = () => {
	const addDeliveryAddress = useAddDeliveryAddressMutation();
	const { goBack } = useNavigation();

	const { control, handleSubmit } = useForm<AddAddressValues>({
		defaultValues: {
			name: '',
			line1: '',
			line2: '',
			city: '',
			state: '',
			country: '',
			postcode: ''
		}
	});

	const onSubmit = React.useCallback(
		async (values: AddAddressValues) => {
			const { line2, postcode, ...rest } = values;
			await addDeliveryAddress.mutateAsync({
				...rest,
				...(line2 ? { line2 } : {}),
				...(postcode ? { postcode } : {})
			});

			goBack();
		},
		[addDeliveryAddress, goBack]
	);

	return (
		<ScrollableScreen>
			<FormInput
				name='name'
				label='Address name'
				placeholder='Home'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='line1'
				label='Address line 1'
				placeholder='123 Main Street'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='line2'
				label='Address line 2'
				placeholder='Apt 4B'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='city'
				label='City'
				placeholder='Lagos'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='state'
				label='State'
				placeholder='Lagos'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='country'
				label='Country'
				placeholder='Nigeria'
				style={styles.input}
				control={control}
			/>
			<FormInput
				name='postcode'
				label='Postcode'
				placeholder='100001'
				style={styles.input}
				control={control}
			/>
			<Button
				text='Add Address'
				onPress={handleSubmit(onSubmit)}
				style={styles.button}
				loading={addDeliveryAddress.isPending}
			/>
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	input: {
		marginBottom: 8
	},
	button: {
		marginTop: 8
	}
});

export default AddAddress;
