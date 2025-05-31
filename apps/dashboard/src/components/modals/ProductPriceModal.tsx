import React from 'react';
import {
	BottomModal,
	Button,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import {
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEditProductMutation } from '../../types/api';
import { StyleSheet } from 'react-native';

interface ProductPriceModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	productId: string;
	initialPrice: number;
}

const ProductPriceModal: React.FC<ProductPriceModalProps> = ({
	modalRef,
	productId,
	initialPrice
}) => {
	const { bottom } = useSafeAreaInsets();
	const [{ fetching }, editProduct] = useEditProductMutation();
	const [price, setPrice] = React.useState(String(initialPrice));
	const { name, theme } = useTheme();

	const handleSubmit = async () => {
		await editProduct({
			id: productId,
			input: {
				unitPrice: initialPrice
			}
		});

		modalRef.current.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography size='xlarge' weight='semibold'>
					Price
				</Typography>
				<Spacer y={16} />
				<BottomSheetTextInput
					style={[styles.input, { color: theme.input.text }]}
					value={price}
					autoFocus
					keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
				/>
				<Spacer y={16} />
				<Button
					text='Save'
					onPress={handleSubmit}
					loading={fetching}
					disabled={fetching}
				/>
			</BottomSheetView>
		</BottomModal>
	);
};

const styles = StyleSheet.create({
	input: {
		fontSize: 32,
		fontWeight: 'medium',
		height: 36
	}
});

export default ProductPriceModal;
