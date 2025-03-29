import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
	BottomModal,
	Button,
	CustomImage,
	Row,
	Spacer,
	Typography
} from '@habiti/components';

import { useManagedStoresQuery } from '../../types/api';

interface StoreSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreSelectModal: React.FC<StoreSelectModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const [{ data }] = useManagedStoresQuery();

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom }}>
				<Typography size='xlarge' weight='bold' style={{ marginLeft: 16 }}>
					Select store
				</Typography>
				<Spacer y={8} />
				{data?.currentUser.managed.map(({ store }) => (
					<Row key={store.id} style={{ alignItems: 'center' }}>
						<CustomImage
							uri={store.image?.path}
							style={{ marginRight: 8 }}
							height={40}
							width={40}
							circle
						/>
						<Typography>{store.name}</Typography>
					</Row>
				))}
				<Spacer y={16} />
				<View style={{ paddingHorizontal: 16 }}>
					<Button onPress={() => {}} text='Create new store' />
				</View>
			</BottomSheetView>
		</BottomModal>
	);
};

export default StoreSelectModal;
