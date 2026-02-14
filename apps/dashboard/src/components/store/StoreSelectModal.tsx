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
import { useShallow } from 'zustand/react/shallow';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useManagedStoresQuery } from '../../data/queries';
import useStore from '../../state';
import { AppStackParamList } from '../../types/navigation';

interface StoreSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreSelectModal: React.FC<StoreSelectModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const { data } = useManagedStoresQuery();
	const { theme } = useTheme();
	const setPreference = useStore(useShallow(state => state.setPreference));
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleCreateStore = () => {
		modalRef.current?.dismiss();

		navigate('Modal.CreateStore');
	};

	const handleSelectStore = (storeId: string) => () => {
		setPreference({ activeStore: storeId });
		modalRef.current?.dismiss();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom }}>
				<Typography size='xlarge' weight='bold' style={{ marginLeft: 16 }}>
					Select store
				</Typography>
				<Spacer y={8} />
				{data?.stores.map(store => (
					<Row
						key={store.id}
						style={{
							backgroundColor: theme.modal.background,
							alignItems: 'center'
						}}
						onPress={handleSelectStore(store.id)}
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
