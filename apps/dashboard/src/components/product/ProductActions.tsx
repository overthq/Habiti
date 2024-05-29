import { Button } from '@market/components';
import React from 'react';
import { Alert, View } from 'react-native';

const ProductActions = () => {
	const handleDelete = () => {
		Alert.alert(
			'Confirm delete',
			'Are you sure you want to delete this product?',
			[{ text: 'Cancel' }, { text: 'Delete' }]
		);
	};

	return (
		<View style={{ padding: 16 }}>
			<Button
				variant='destructive'
				text='Delete product'
				onPress={handleDelete}
			/>
		</View>
	);
};

export default ProductActions;
