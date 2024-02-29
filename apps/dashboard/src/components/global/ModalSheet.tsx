import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
// import useTheme from '../../hooks/useTheme';

interface ModalSheetProps {
	children: React.ReactNode;
}

const ModalSheet: React.FC<ModalSheetProps> = ({ children }) => {
	// const { theme } = useTheme();

	return <BottomSheet>{children}</BottomSheet>;
};

export default ModalSheet;
