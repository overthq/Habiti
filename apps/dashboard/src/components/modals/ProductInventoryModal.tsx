import React from 'react';
import {
	Button,
	Icon,
	SheetTextInput,
	SheetView,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUpdateProductMutation } from '../../data/mutations';
import { applyFontStyles } from '@habiti/components/src/Typography';
import { useSheet, useSheetParams } from '../../navigation/Sheets';

const ProductInventoryModal = () => {
	const { productId, initialQuantity } = useSheetParams<'productInventory'>();
	const { closeSheet } = useSheet();
	const [quantity, setQuantity] = React.useState(initialQuantity);
	const updateProductMutation = useUpdateProductMutation();
	const { name, theme } = useTheme();

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
				<Pressable onPress={decrementQuantity}>
					<Icon name='minus' size={24} />
				</Pressable>

				<SheetTextInput
					autoFocus
					value={quantity.toString()}
					onChangeText={handleQuantityChange}
					keyboardType='numeric'
					style={[
						styles.quantityInput,
						{ color: theme.input.text, borderColor: theme.border.color },
						applyFontStyles()
					]}
					textAlign='center'
					keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
				/>

				<Pressable onPress={incrementQuantity}>
					<Icon name='plus' size={24} />
				</Pressable>
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
		gap: 8
	},
	quantityButton: {
		minWidth: 48
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
