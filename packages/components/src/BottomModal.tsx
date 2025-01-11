import React from 'react';
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModalProps
} from '@gorhom/bottom-sheet';

import { useTheme } from './Theme';

interface ModalSheetProps extends BottomSheetModalProps {
	children: React.ReactNode;
	modalRef: React.RefObject<BottomSheetModal>;
}

const ModalSheet: React.FC<ModalSheetProps> = ({ modalRef, ...props }) => {
	const { theme } = useTheme();

	const renderBackdrop = React.useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				pressBehavior='close'
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<BottomSheetModal
			index={0}
			ref={modalRef}
			backgroundStyle={{ backgroundColor: theme.screen.background }}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			enablePanDownToClose
			backdropComponent={renderBackdrop}
			{...props}
		/>
	);
};

export default ModalSheet;
