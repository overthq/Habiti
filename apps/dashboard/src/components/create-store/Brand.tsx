import { FormInput, Screen, Typography } from '@market/components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Brand: React.FC = () => {
	const { control } = useFormContext();

	return (
		<Screen style={styles.container}>
			<Typography weight='bold' size='xxxlarge'>
				Your brand
			</Typography>
			<Typography>Please enter the name of your store.</Typography>
			<FormInput control={control} name='name' placeholder='Nike' />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		padding: 16
	}
});

export default Brand;
