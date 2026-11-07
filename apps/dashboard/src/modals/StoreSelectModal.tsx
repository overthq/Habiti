import React from 'react';
import { View } from 'react-native';
import {
	Avatar,
	Button,
	Icon,
	Row,
	SheetView,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useShallow } from 'zustand/react/shallow';

import { useManagedStoresQuery } from '../data/queries';
import { useSwitchStoreMutation } from '../data/mutations';
import useStore from '../state';
import { navigationRef } from '../navigation/utils';
import { STORE_CREATION_ENABLED } from '../utils/constants';
import { useSheet } from '../navigation/useSheet';

const StoreSelectModal = () => {
	const { data } = useManagedStoresQuery();
	const { theme } = useTheme();
	const { closeSheet } = useSheet();
	const activeStore = useStore(useShallow(state => state.activeStore));
	const switchStoreMutation = useSwitchStoreMutation();

	const handleCreateStore = () => {
		closeSheet();

		navigationRef.navigate('Modal.CreateStore');
	};

	const handleSelectStore = (storeId: string) => () => {
		switchStoreMutation.mutate(storeId, { onSuccess: closeSheet });
	};

	return (
		<SheetView>
			<Typography size='xlarge' weight='bold' style={{ marginLeft: 16 }}>
				Select store
			</Typography>
			<Spacer y={8} />
			{data?.stores.map(store => {
				const selected = store.id === activeStore;

				return (
					<Row
						key={store.id}
						style={{
							backgroundColor: selected
								? theme.border.color
								: theme.modal.background,
							borderRadius: 12,
							marginHorizontal: 8,
							paddingHorizontal: 8,
							paddingVertical: 10,
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
						onPress={handleSelectStore(store.id)}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Avatar
								uri={store.image?.path}
								fallbackText={store.name}
								size={40}
								circle
								bordered
								style={{ marginRight: 8 }}
							/>
							<Typography>{store.name}</Typography>
						</View>
						{selected && (
							<Icon
								name='check'
								size={20}
								color={theme.text.primary}
								style={{ marginRight: 4 }}
							/>
						)}
					</Row>
				);
			})}

			{STORE_CREATION_ENABLED && (
				<>
					<Spacer y={16} />

					<View style={{ paddingHorizontal: 16 }}>
						<Button onPress={handleCreateStore} text='Create new store' />
					</View>
				</>
			)}
		</SheetView>
	);
};

export default StoreSelectModal;
