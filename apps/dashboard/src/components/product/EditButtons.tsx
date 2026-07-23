import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Typography, useTheme, Spacer, Icon } from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { Product } from '../../data/types';
import { useSheet } from '../../navigation/Sheets';

interface EditButtonsProps {
	product: Product;
}

const EditButtons: React.FC<EditButtonsProps> = ({ product }) => {
	const { openSheet } = useSheet();

	const openPriceModal = () => {
		openSheet('productPrice', {
			productId: product.id,
			initialPrice: product.unitPrice
		});
	};

	const openInventoryModal = () => {
		openSheet('productInventory', {
			productId: product.id,
			initialQuantity: product.quantity
		});
	};

	return (
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
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Typography size='xlarge' weight='medium'>
					{value}
				</Typography>
				<Spacer x={8} />
				<Icon name='pencil' size={16} />
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 12
	},
	button: {
		flex: 1,
		borderRadius: 6,
		padding: 12
	}
});

export default EditButtons;
