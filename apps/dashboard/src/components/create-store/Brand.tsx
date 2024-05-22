import { FormInput, Spacer, Typography } from '@market/components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { StyleSheet, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

const Brand: React.FC = () => {
	const { control } = useFormContext();

	return (
		<View style={styles.container}>
			<Typography weight='bold' size='xxxlarge'>
				Your brand
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				Please enter the name of your store.
			</Typography>
			<Spacer y={16} />
			<FormInput
				control={control}
				name='name'
				label='Store name'
				placeholder='Nike'
			/>
			<Spacer y={16} />
			<FormInput
				control={control}
				name='description'
				label='Store description'
				placeholder='Brief description of your store'
				textArea
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		padding: 16
	}
});

export default Brand;
