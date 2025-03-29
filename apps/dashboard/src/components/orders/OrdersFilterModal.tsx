import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Typography } from '@habiti/components';

const OrdersFilterModal = () => {
	const modalRef = React.useRef<BottomSheetModal>(null);

	return (
		<BottomModal modalRef={modalRef}>
			<BottomSheetView>
				<Typography>Filter</Typography>
			</BottomSheetView>
		</BottomModal>
	);
};

export default OrdersFilterModal;
