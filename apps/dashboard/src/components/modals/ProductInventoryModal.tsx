import React from 'react';
import {
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView
} from '@gorhom/bottom-sheet';
import {
	BottomModal,
	Button,
	Icon,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { View, StyleSheet, Pressable } from 'react-native';
import { useEditProductMutation } from '../../types/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductInventoryModalProps {
	productId: string;
	initialQuantity: number;
	modalRef: React.RefObject<BottomSheetModal>;
}

const ProductInventoryModal: React.FC<ProductInventoryModalProps> = ({
	productId,
	initialQuantity,
	modalRef
}) => {
	const [quantity, setQuantity] = React.useState(initialQuantity);
	const [{ fetching }, editProduct] = useEditProductMutation();
	const { bottom } = useSafeAreaInsets();
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
		await editProduct({
			id: productId,
			input: { quantity }
		});

		modalRef.current?.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography size='xlarge' weight='semibold'>
					Inventory
				</Typography>
				<Spacer y={16} />
				<View style={styles.quantityContainer}>
					<Pressable onPress={decrementQuantity}>
						<Icon name='minus' size={24} />
					</Pressable>
					<BottomSheetTextInput
						autoFocus
						value={quantity.toString()}
						onChangeText={handleQuantityChange}
						keyboardType='numeric'
						style={[
							styles.quantityInput,
							{ color: theme.input.text, borderColor: theme.border.color }
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
					loading={fetching}
					disabled={fetching || !hasQuantityChanged}
				/>
			</BottomSheetView>
		</BottomModal>
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
		padding: 12,
		minWidth: 80,
		fontSize: 32
	}
});

export default ProductInventoryModal;
