import React from 'react';
import { View, Pressable, RefreshControl } from 'react-native';
import {
	Avatar,
	Button,
	Icon,
	Screen,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PayoutsHeader from '../components/payouts/PayoutsHeader';
import RecentTransactions from '../components/store/RecentTransactions';
import StoreSelectModal from '../components/store/StoreSelectModal';

import { useCurrentStoreQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import useStore from '../state';
import { useShallow } from 'zustand/react/shallow';

import type {
	AppStackParamList,
	StoreStackParamList
} from '../navigation/types';

const Store = () => {
	const { data, refetch, isLoading, error } = useCurrentStoreQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();
	const { logOut } = useStore(useShallow(({ logOut }) => ({ logOut })));
	const modalRef = React.useRef<BottomSheetModal>(null);

	const handleNewPayout = () => {
		navigate('Modal.AddPayout', {
			realizedRevenue: data?.store.realizedRevenue ?? 0,
			paidOut: data?.store.paidOut ?? 0
		});
	};

	const handleOpenSettings = React.useCallback(() => {
		navigate('StoreSettings');
	}, []);

	const handleViewBalanceDetails = React.useCallback(() => {
		navigate('BalanceDetails');
	}, []);

	const handleSwitchStore = React.useCallback(() => {
		modalRef.current?.present();
	}, []);

	if (isLoading || !data?.store) {
		return <View />;
	}

	if (error) {
		return (
			<View>
				<Button text='Log Out' onPress={logOut} />
			</View>
		);
	}

	const store = data.store;

	return (
		<Screen style={{ paddingTop: top }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: 16,
					paddingVertical: 12,
					borderBottomWidth: 0.5,
					borderBottomColor: theme.border.color
				}}
			>
				<Pressable
					onPress={handleSwitchStore}
					style={{ flexDirection: 'row', alignItems: 'center' }}
				>
					<Avatar
						uri={store.image?.path}
						fallbackText={store.name}
						size={32}
						circle
					/>
					<Spacer x={10} />
					<Typography size='xxlarge' weight='bold'>
						{store.name}
					</Typography>
					<Spacer x={4} />
					<Icon name='chevron-down' size={20} />
				</Pressable>

				<View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
					<Pressable onPress={handleOpenSettings}>
						<Icon name='menu' size={22} />
					</Pressable>
				</View>
			</View>

			<ScrollableScreen
				style={{ paddingHorizontal: 16 }}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						tintColor={theme.text.secondary}
					/>
				}
			>
				<PayoutsHeader
					realizedRevenue={store.realizedRevenue ?? 0}
					paidOut={store.paidOut ?? 0}
					onViewDetails={handleViewBalanceDetails}
				/>
				<Spacer y={16} />
				<RecentTransactions />
			</ScrollableScreen>
			<StoreSelectModal modalRef={modalRef} />
		</Screen>
	);
};

export default Store;
