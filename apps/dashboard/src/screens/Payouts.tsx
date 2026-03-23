import React from 'react';
import { View, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Icon, Screen, ScreenHeader, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { HeaderButton } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PayoutRow from '../components/payouts/PayoutRow';
import PayoutsHeader from '../components/payouts/PayoutsHeader';
import NoPayouts from '../components/payouts/NoPayouts';

import useGoBack from '../hooks/useGoBack';
import { useCurrentStoreQuery, usePayoutsQuery } from '../data/queries';

import type { AppStackParamList } from '../types/navigation';

const Payouts = () => {
	const { data, refetch, isRefetching } = useCurrentStoreQuery();
	const { data: payoutData } = usePayoutsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();

	useGoBack();

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, []);

	const handleNewPayout = React.useCallback(() => {
		navigate('Modal.AddPayout');
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleNewPayout}>
					<Icon name='plus' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: { type: 'sfSymbol', name: 'plus' },
					onPress: handleNewPayout
				}
			]
		});
	}, []);

	if (!data || !payoutData) {
		return <View />;
	}

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader
				title='Payouts'
				right={
					<Pressable onPress={handleNewPayout}>
						<Icon name='plus' />
					</Pressable>
				}
				hasBottomBorder
			/>
			<View style={styles.container}>
				<FlashList
					contentContainerStyle={{
						flexGrow: 1,
						backgroundColor: theme.screen.background
					}}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							onRefresh={refetch}
							tintColor={theme.text.secondary}
						/>
					}
					ListHeaderComponent={
						<PayoutsHeader
							hasLinkedBankAccount={!!data.store.bankAccountNumber}
							realizedRevenue={data.store.realizedRevenue ?? 0}
							unrealizedRevenue={data.store.unrealizedRevenue ?? 0}
							paidOut={data.store.paidOut ?? 0}
							onAddPayoutAccount={handleAddPayoutAccount}
						/>
					}
					data={payoutData.payouts}
					keyExtractor={p => p.id}
					renderItem={({ item }) => <PayoutRow key={item.id} payout={item} />}
					ListEmptyComponent={<NoPayouts action={handleNewPayout} />}
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Payouts;
