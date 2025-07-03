import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
	Avatar,
	BottomModal,
	Button,
	Row,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import { useManagedStoresQuery } from '../../types/api';

interface StoreSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreSelectModal: React.FC<StoreSelectModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const [{ data }] = useManagedStoresQuery();
	const { theme } = useTheme();

	const handleCreateStore = () => {
		modalRef.current?.dismiss();
		// TODO: Allow the ability to create a new store, or just log the user out.
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom }}>
				<Typography size='xlarge' weight='bold' style={{ marginLeft: 16 }}>
					Select store
				</Typography>
				<Spacer y={8} />
				{data?.currentUser.managed.map(({ store }) => (
					<Row
						key={store.id}
						style={{
							backgroundColor: theme.modal.background,
							alignItems: 'center'
						}}
					>
						<Avatar
							uri={store.image?.path}
							fallbackText={store.name}
							size={40}
							circle
							style={{ marginRight: 8 }}
						/>
						<Typography>{store.name}</Typography>
					</Row>
				))}

				<Spacer y={16} />

				<View style={{ paddingHorizontal: 16 }}>
					<Button onPress={handleCreateStore} text='Create new store' />
				</View>
			</BottomSheetView>
		</BottomModal>
	);
};

export default StoreSelectModal;
