import React from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ConfirmationModalContext = React.createContext<{
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
	onConfirm: () => void;
	onCancel: () => void;
	openModal: (options: OpenModalOptions) => void;
} | null>(null);

interface OpenModalOptions {
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
}

interface ConfirmationModalProps {
	children: React.ReactNode;
}

const ConfirmationModalProvider: React.FC<ConfirmationModalProps> = ({
	children
}) => {
	const [title, setTitle] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [confirmText, setConfirmText] = React.useState('');
	const [cancelText, setCancelText] = React.useState('');
	const onConfirmCallbackRef = React.useRef<(() => void) | null>(null);
	const modalRef = React.useRef<BottomSheetModal>(null);
	const { bottom } = useSafeAreaInsets();

	const openModal = (options: OpenModalOptions) => {
		setTitle(options.title);
		setDescription(options.description);
		setConfirmText(options.confirmText || 'Confirm');
		setCancelText(options.cancelText || 'Cancel');
		onConfirmCallbackRef.current = options.onConfirm;

		modalRef.current?.present();
	};

	const onConfirm = () => {
		onConfirmCallbackRef.current?.();
		modalRef.current?.dismiss();
	};

	const onCancel = () => {
		modalRef.current?.dismiss();
	};

	return (
		<ConfirmationModalContext.Provider
			value={{
				title,
				description,
				confirmText,
				cancelText,
				onConfirm,
				onCancel,
				openModal
			}}
		>
			{children}
			<BottomModal modalRef={modalRef}>
				<BottomSheetView
					style={{ paddingBottom: bottom, paddingHorizontal: 16 }}
				>
					<Typography weight='semibold' size='large'>
						{title}
					</Typography>
					<Spacer y={8} />
					<Typography>{description}</Typography>
					<Spacer y={16} />
					<View style={{ flexDirection: 'row', gap: 16 }}>
						<Button onPress={onConfirm} text={confirmText} />
						<Button onPress={onCancel} text={cancelText} />
					</View>
				</BottomSheetView>
			</BottomModal>
		</ConfirmationModalContext.Provider>
	);
};

export const useConfirmationModal = () => {
	const context = React.useContext(ConfirmationModalContext);

	if (!context) {
		throw new Error(
			'useConfirmationModal must be used within a ConfirmationModalProvider'
		);
	}

	return context;
};

export { ConfirmationModalProvider, ConfirmationModalContext };
