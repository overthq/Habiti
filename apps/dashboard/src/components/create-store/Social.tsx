import { FormInput, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Social = () => {
	const { control } = useFormContext();

	return (
		<View style={styles.container}>
			<Typography size='xxxlarge' weight='bold'>
				Social media
			</Typography>
			<Typography variant='secondary'>
				Link your social accounts, so shoppers can follow you elsewhere.
			</Typography>
			<Spacer y={16} />
			<FormInput
				control={control}
				label='Twitter username'
				name='twitter'
				placeholder='@nike'
				autoCapitalize='none'
				autoCorrect={false}
			/>
			<Spacer y={16} />
			<FormInput
				control={control}
				label='Instagram username'
				name='instagram'
				placeholder='@nike'
				autoCapitalize='none'
				autoCorrect={false}
			/>
			<Spacer y={16} />
			<FormInput
				control={control}
				label='Website'
				name='website'
				placeholder='https://nike.com'
				keyboardType='url'
				autoCorrect={false}
				autoCapitalize='none'
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

export default Social;
