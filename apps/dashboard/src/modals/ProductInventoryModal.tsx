import React from 'react';
import {
	BaseInput,
	Button,
	IconButton,
	SheetTextInput,
	SheetView,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { StyleSheet, View } from 'react-native';
import { useUpdateProductMutation } from '../data/mutations';
import { useSheet, useSheetParams } from '../navigation/useSheet';

const ProductInventoryModal = () => {
	const { productId, initialQuantity } = useSheetParams<'productInventory'>();
	const { closeSheet } = useSheet();
	const [quantity, setQuantity] = React.useState(initialQuantity);
	const updateProductMutation = useUpdateProductMutation();
	const { theme } = useTheme();

	const hasQuantityChanged = quantity !== initialQuantity;

	const incrementQuantity = () => setQuantity(prev => prev + 1);
	const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

	const handleQuantityChange = (text: string) => {
		const newQuantity = parseInt(text) || 0;
		setQuantity(Math.max(0, newQuantity));
	};

	// TODO: Add error handling
	const handleSubmit = async () => {
		await updateProductMutation.mutateAsync({
			productId,
			body: { quantity }
		});

		closeSheet();
	};

	return (
		<SheetView style={{ paddingHorizontal: 16 }}>
			<Typography size='xlarge' weight='semibold'>
				Inventory
			</Typography>

			<Spacer y={16} />

			<View style={styles.quantityContainer}>
				<IconButton
					name='minus'
					onPress={decrementQuantity}
					accessibilityLabel='Decrease quantity'
				/>

				<BaseInput
					as={SheetTextInput}
					autoFocus
					number
					value={quantity.toString()}
					onChangeText={handleQuantityChange}
					keyboardType='numeric'
					style={[styles.quantityInput, { borderColor: theme.border.color }]}
					textAlign='center'
				/>

				<IconButton
					name='plus'
					onPress={incrementQuantity}
					accessibilityLabel='Increase quantity'
				/>
			</View>

			<Spacer y={16} />

			<Button
				text='Save'
				onPress={handleSubmit}
				loading={updateProductMutation.isPending}
				disabled={updateProductMutation.isPending || !hasQuantityChanged}
			/>
		</SheetView>
	);
};

const styles = StyleSheet.create({
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12
	},
	quantityInput: {
		borderWidth: 1,
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 16,
		minWidth: 80,
		fontSize: 32
	}
});

export default ProductInventoryModal;
