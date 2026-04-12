import React from 'react';
import { View, RefreshControl, StyleSheet, Linking, Alert } from 'react-native';
import {
	Button,
	PillButton,
	Screen,
	ScrollableScreen,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OnboardingChecklist from '../components/store/OnboardingChecklist';
import StoreSelectModal from '../components/store/StoreSelectModal';

import { useAddressesQuery, useCurrentStoreQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import useStore from '../state';
import { useShallow } from 'zustand/react/shallow';
import { getFrontendUrl } from '../utils/share';

import type {
	AppStackParamList,
	StoreStackParamList
} from '../navigation/types';
import StoreHeader from '../components/store/StoreHeader';

const Store = () => {
	const { data, refetch, isLoading, error } = useCurrentStoreQuery();
	const { data: addressesData } = useAddressesQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();
	const { logOut } = useStore(useShallow(({ logOut }) => ({ logOut })));
	const modalRef = React.useRef<BottomSheetModal>(null);

	const handleNewPayout = () => {
		if (!data?.store) return;

		if (!data.store.bankAccountNumber) {
			Alert.alert(
				'No bank account linked',
				'You must link a bank account before requesting a payout'
			);

			return;
		}

		navigate('Modal.AddPayout', {
			realizedRevenue: data.store.realizedRevenue ?? 0,
			paidOut: data.store.paidOut ?? 0
		});
	};

	const handleSwitchStore = React.useCallback(() => {
		modalRef.current?.present();
	}, []);

	const handleOpenBalanceDetails = React.useCallback(() => {
		navigate('BalanceDetails');
	}, []);

	const handleOpenSettings = React.useCallback(() => {
		navigate('StoreSettings');
	}, []);

	const handleOpenWebPage = React.useCallback(() => {
		if (data?.store) {
			Linking.openURL(getFrontendUrl(`/store/${data.store.id}`));
		}
	}, [data?.store?.id]);

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
	const available = (store.realizedRevenue ?? 0) - (store.paidOut ?? 0);

	return (
		<Screen style={{ paddingTop: top }}>
			<StoreHeader
				store={store}
				onOpenSettings={handleOpenSettings}
				onOpenWebPage={handleOpenWebPage}
				onSwitchStore={handleSwitchStore}
			/>

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
				<Spacer y={16} />

				<View>
					<Typography variant='secondary' size='small'>
						Available
					</Typography>

					<Spacer y={8} />

					<Typography size='xxxlarge' weight='bold'>
						{formatNaira(available)}
					</Typography>
				</View>

				<Spacer y={16} />

				<View style={styles.actions}>
					<PillButton
						text='Request payout'
						onPress={handleNewPayout}
						style={{ flex: 1 }}
					/>

					<Spacer x={8} />

					<PillButton
						text='Manage'
						variant='secondary'
						onPress={handleOpenBalanceDetails}
						style={{ flex: 1 }}
					/>
				</View>

				<Spacer y={16} />

				<Separator />

				<Spacer y={16} />

				<OnboardingChecklist
					store={store}
					addresses={addressesData?.addresses ?? []}
				/>

				<Spacer y={16} />
			</ScrollableScreen>
			<StoreSelectModal modalRef={modalRef} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	storeInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	actions: {
		flexDirection: 'row'
	}
});

export default Store;
