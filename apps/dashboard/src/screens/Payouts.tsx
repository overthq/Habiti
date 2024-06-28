import { formatNaira } from '@habiti/common';
import {
	Icon,
	Screen,
	SectionHeader,
	Spacer,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';

import PayoutRow from '../components/payouts/PayoutRow';
import RevenueBar from '../components/payouts/RevenueBar';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

interface NoPayoutsProps {
	action(): void;
}

const NoPayouts: React.FC<NoPayoutsProps> = ({ action }) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6,
				marginVertical: 8
			}}
		>
			<Typography weight='medium' size='large'>
				No payouts
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				Created payouts will appear here.
			</Typography>
			<Spacer y={8} />
			<View style={{ backgroundColor: theme.border.color, height: 1 }} />
			<Spacer y={8} />
			<TextButton onPress={action}>Add payout</TextButton>
		</View>
	);
};

const Payouts = () => {
	const [{ data, fetching }, refetch] = useStorePayoutsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	useGoBack();

	const handleNewPayout = React.useCallback(() => {
		navigate('AddPayout');
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={handleNewPayout}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<Screen style={styles.container}>
			<FlashList
				refreshControl={
					<RefreshControl
						refreshing={fetching}
						onRefresh={() => {
							refetch({ requestPolicy: 'network-only' });
						}}
						tintColor={theme.text.secondary}
					/>
				}
				ListHeaderComponent={
					<>
						<SectionHeader title='Available' padded={false} />
						<Typography size='xxxlarge' weight='bold' style={styles.available}>
							{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
						</Typography>
						<RevenueBar
							realizedRevenue={data?.currentStore.realizedRevenue}
							unrealizedRevenue={data?.currentStore.unrealizedRevenue}
							paidOut={data?.currentStore.paidOut}
						/>
						<Spacer y={16} />
						<SectionHeader title='Payout History' padded={false} />
					</>
				}
				data={data.currentStore.payouts}
				keyExtractor={p => p.id}
				renderItem={({ item }) => <PayoutRow key={item.id} payout={item} />}
				ListEmptyComponent={<NoPayouts action={handleNewPayout} />}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	available: {
		marginBottom: 8
	}
});

export default Payouts;
