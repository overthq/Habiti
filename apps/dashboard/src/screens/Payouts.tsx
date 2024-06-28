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
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import PayoutRow from '../components/payouts/PayoutRow';
import RevenueBar from '../components/payouts/RevenueBar';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Payouts = () => {
	const [{ data, fetching }] = useStorePayoutsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();
	const { theme } = useTheme();

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
			<SectionHeader title='Available' padded={false} />
			<Typography size='xxxlarge' weight='bold' style={styles.available}>
				{formatNaira(data?.currentStore.realizedRevenue ?? 0)}
			</Typography>
			<RevenueBar
				realizedRevenue={data?.currentStore.realizedRevenue}
				unrealizedRevenue={data?.currentStore.unrealizedRevenue}
				paidOut={data?.currentStore.paidOut}
			/>
			<Spacer y={24} />
			<SectionHeader title='Payout History' padded={false} />
			{data.currentStore.payouts.length === 0 ? (
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
					<TextButton onPress={handleNewPayout}>Add payout</TextButton>
				</View>
			) : (
				<>
					{data.currentStore.payouts.map(payout => (
						<PayoutRow key={payout.id} payout={payout} />
					))}
				</>
			)}
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
