import React from 'react';
import { StyleSheet } from 'react-native';
import {
	Button,
	SheetTextInput,
	SheetView,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useUpdateProductMutation } from '../../data/mutations';
import { applyFontStyles } from '@habiti/components/src/Typography';
import { useSheet, useSheetParams } from '../../navigation/Sheets';

const ProductPriceModal = () => {
	const { productId, initialPrice } = useSheetParams<'productPrice'>();
	const { closeSheet } = useSheet();
	const [price, setPrice] = React.useState(String(initialPrice / 100));
	const { name, theme } = useTheme();
	const updateProductMutation = useUpdateProductMutation();

	const isInitialPrice = price === String(initialPrice / 100);

	const handleSubmit = async () => {
		await updateProductMutation.mutateAsync({
			productId,
			body: { unitPrice: Number(price) * 100 }
		});

		closeSheet();
	};

	return (
		<SheetView style={{ paddingHorizontal: 16 }}>
			<Typography size='xlarge' weight='semibold'>
				Price
			</Typography>

			<Spacer y={16} />

			<SheetTextInput
				autoFocus
				style={[
					styles.input,
					{
						color: theme.input.text,
						textAlignVertical: 'top',
						includeFontPadding: false
					},
					applyFontStyles()
				]}
				value={price}
				onChangeText={setPrice}
				keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
				keyboardType='numeric'
			/>

			<Spacer y={16} />

			<Button
				text='Save'
				onPress={handleSubmit}
				loading={updateProductMutation.isPending}
				disabled={updateProductMutation.isPending || isInitialPrice}
			/>
		</SheetView>
	);
};

const styles = StyleSheet.create({
	input: {
		fontSize: 32,
		fontWeight: 'medium',
		padding: 12,
		alignSelf: 'center'
	}
});

export default ProductPriceModal;
