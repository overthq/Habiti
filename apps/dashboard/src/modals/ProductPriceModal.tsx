import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
	BaseInput,
	Button,
	SheetTextInput,
	SheetView,
	Spacer,
	Typography
} from '@habiti/components';
import { useUpdateProductMutation } from '../data/mutations';
import { useSheet, useSheetParams } from '../navigation/useSheet';

const KOBO_PER_NAIRA = 100;

const ProductPriceModal = () => {
	const { productId, initialPrice } = useSheetParams<'productPrice'>();
	const { closeSheet } = useSheet();
	const [price, setPrice] = React.useState(
		String(Math.round(initialPrice / KOBO_PER_NAIRA))
	);
	const updateProductMutation = useUpdateProductMutation();

	const priceInKobo = Number(price || 0) * KOBO_PER_NAIRA;
	const isInitialPrice = priceInKobo === initialPrice;

	const handlePriceChange = (text: string) => {
		setPrice(text.replace(/[^0-9]/g, ''));
	};

	const handleSubmit = async () => {
		await updateProductMutation.mutateAsync({
			productId,
			body: { unitPrice: priceInKobo }
		});

		closeSheet();
	};

	return (
		<SheetView style={{ paddingHorizontal: 16 }}>
			<Typography size='xlarge' weight='semibold'>
				Price
			</Typography>

			<Spacer y={16} />

			<View style={styles.inputRow}>
				<Typography style={styles.currency}>₦</Typography>

				<BaseInput
					as={SheetTextInput}
					autoFocus
					number
					style={styles.input}
					value={price}
					onChangeText={handlePriceChange}
					keyboardType='number-pad'
					placeholder='0'
				/>
			</View>

			<Spacer y={16} />

			<Button
				text='Save'
				onPress={handleSubmit}
				loading={updateProductMutation.isPending}
				disabled={
					updateProductMutation.isPending ||
					isInitialPrice ||
					price.length === 0
				}
			/>
		</SheetView>
	);
};

const styles = StyleSheet.create({
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	currency: {
		fontSize: 32,
		fontWeight: 'medium'
	},
	input: {
		fontSize: 32,
		fontWeight: 'medium',
		paddingVertical: 12,
		textAlignVertical: 'top'
	}
});

export default ProductPriceModal;
