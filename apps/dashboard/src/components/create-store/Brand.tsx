import { FormInput, Screen, Spacer, Typography } from '@market/components';
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
			<Spacer y={2} />
			<Typography variant='secondary'>
				Please enter the name of your store.
			</Typography>
			<Spacer y={8} />
			<FormInput
				control={control}
				name='name'
				label='Store name'
				placeholder='Nike'
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
