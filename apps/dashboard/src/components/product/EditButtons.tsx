import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ProductQuery } from '../../types/api';
import ProductPriceModal from '../modals/ProductPriceModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ProductInventoryModal from '../modals/ProductInventoryModal';
import { Typography, useTheme, Spacer } from '@habiti/components';
import { formatNaira } from '@habiti/common';

interface EditButtonsProps {
	product: ProductQuery['product'];
}

const EditButtons: React.FC<EditButtonsProps> = ({ product }) => {
	const priceModalRef = React.useRef<BottomSheetModal>(null);
	const inventoryModalRef = React.useRef<BottomSheetModal>(null);

	const openPriceModal = () => {
		priceModalRef.current?.present();
	};
	const openInventoryModal = () => {
		inventoryModalRef.current?.present();
	};

	return (
		<>
			<View style={styles.container}>
				<EditButton
					label='Price'
					onPress={openPriceModal}
					value={formatNaira(product.unitPrice)}
				/>
				<EditButton
					label='Inventory'
					onPress={openInventoryModal}
					value={product.quantity.toString()}
				/>
			</View>
			<ProductPriceModal
				modalRef={priceModalRef}
				productId={product.id}
				initialPrice={product.unitPrice}
			/>
			<ProductInventoryModal
				modalRef={inventoryModalRef}
				productId={product.id}
				initialQuantity={product.quantity}
			/>
		</>
	);
};

interface EditButtonProps {
	label: string;
	value: string;
	onPress(): void;
}

const EditButton: React.FC<EditButtonProps> = ({ label, value, onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={[styles.button, { backgroundColor: theme.input.background }]}
		>
			<Typography size='small' variant='secondary' weight='semibold'>
				{label}
			</Typography>
			<Spacer y={4} />
			<Typography size='xlarge' weight='medium'>
				{value}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16
	},
	button: {
		flex: 1,
		borderRadius: 6,
		padding: 12
	}
});

export default EditButtons;
