import { formatNaira } from '@market/common';
import {
	Icon,
	Screen,
	SectionHeader,
	Spacer,
	Typography
} from '@market/components';
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

	const handleNewPayout = React.useCallback(() => {
		navigate('AddPayout');
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable style={{ marginRight: 16 }} onPress={handleNewPayout}>
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
				{formatNaira(50000)}
			</Typography>
			<RevenueBar realizedRevenue={75} unrealizedRevenue={50} payedOut={25} />
			<Spacer y={24} />
			<SectionHeader title='Payout History' padded={false} />
			{data.currentStore.payouts.length === 0 ? (
				<View style={{ paddingTop: 16 }}>
					<Typography
						size='small'
						variant='secondary'
						style={{ textAlign: 'center' }}
					>
						You do not have any previous payouts. When you do, they will be
						displayed here.
					</Typography>
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
