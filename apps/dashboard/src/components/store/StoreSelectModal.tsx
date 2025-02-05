import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Button, Spacer, Typography } from '@habiti/components';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useManagedStoresQuery } from '../../types/api';

interface StoreSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreSelectModal: React.FC<StoreSelectModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const [{ data }] = useManagedStoresQuery();

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography size='xlarge' weight='bold'>
					Select store
				</Typography>
				<Spacer y={8} />
				{data?.currentUser.managed.map(({ store }) => (
					<View key={store.id} style={{ paddingVertical: 8 }}>
						<Typography>{store.name}</Typography>
					</View>
				))}
				<Spacer y={16} />
				<Button onPress={() => {}} text='Create new store' />
			</BottomSheetView>
		</BottomModal>
	);
};

export default StoreSelectModal;
