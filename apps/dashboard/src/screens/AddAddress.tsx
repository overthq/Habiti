import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import {
	Button,
	FormInput,
	ScrollableScreen,
	Spacer
} from '@habiti/components';

import { useCreateAddressMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';

interface AddAddressValues {
	name: string;
	line1: string;
	line2: string;
	city: string;
	state: string;
	country: string;
	postcode: string;
}

const AddAddress: React.FC<AppStackScreenProps<'Modal.AddAddress'>> = ({
	navigation
}) => {
	const createAddressMutation = useCreateAddressMutation();

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
			await createAddressMutation.mutateAsync({
				...rest,
				...(line2 ? { line2 } : {}),
				...(postcode ? { postcode } : {})
			});

			navigation.goBack();
		},
		[createAddressMutation, navigation]
	);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<FormInput
				autoFocus
				name='name'
				label='Address name'
				placeholder='Main store'
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
				placeholder='Suite 4B'
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
				loading={createAddressMutation.isPending}
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
