import React from 'react';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet';
import { Button, Spacer, Typography, useTheme } from '@habiti/components';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useManagedStoresQuery } from '../../types/api';

interface StoreSelectModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

const StoreSelectModal: React.FC<StoreSelectModalProps> = ({ modalRef }) => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();
	const [{ data, error }] = useManagedStoresQuery();

	React.useEffect(() => {
		console.log({ error });
	}, [error]);

	return (
		<BottomSheetModal
			ref={modalRef}
			enableDynamicSizing
			backdropComponent={props => (
				<BottomSheetBackdrop
					{...props}
					pressBehavior='close'
					disappearsOnIndex={-1}
					appearsOnIndex={0}
				/>
			)}
			handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
			backgroundStyle={{ backgroundColor: theme.screen.background }}
		>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography size='xlarge' weight='bold'>
					Select store
				</Typography>
				<Spacer y={8} />
				{data?.currentUser.managed.map(({ id, store }) => (
					<View key={store.id} style={{ paddingVertical: 8 }}>
						<Typography>{store.name}</Typography>
					</View>
				))}
				<Spacer y={16} />
				<Button onPress={() => {}} text='Create new store' />
			</BottomSheetView>
		</BottomSheetModal>
	);
};

export default StoreSelectModal;
