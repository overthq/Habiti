import React from 'react';
import { Alert } from 'react-native';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductSettingsProps {
	productId: string;
	modalRef: React.RefObject<BottomSheetModal>;
}

const ProductSettings: React.FC<ProductSettingsProps> = ({
	productId,
	modalRef
}) => {
	const { bottom } = useSafeAreaInsets();

	const handleDelete = () => {
		Alert.alert(
			'Confirm delete',
			'Are you sure you want to delete this product?',
			[{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }]
		);
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingHorizontal: 16, paddingBottom: bottom }}>
				<Typography weight='medium' size='xlarge'>
					Product Settings
				</Typography>
				<Spacer y={16} />
				<Button
					variant='destructive'
					text='Delete product'
					onPress={handleDelete}
				/>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductSettings;
