import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { formatNaira } from '../utils/currency';
import { Icon } from '../components/Icon';
import { AppStackParamList } from '../types/navigation';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import SectionHeader from '../components/global/SectionHeader';
import PayoutRow from '../components/payouts/PayoutRow';
import RevenueBar from '../components/payouts/RevenueBar';

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
			headerRight: () => {
				return (
					<Pressable style={{ marginRight: 16 }} onPress={handleNewPayout}>
						<Icon name='plus' />
					</Pressable>
				);
			}
		});
	}, []);

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<Screen style={styles.container}>
			<SectionHeader title='Available:' />
			<Typography style={styles.available}>{formatNaira(50000)}</Typography>
			<RevenueBar realizedRevenue={75} unrealizedRevenue={50} payedOut={25} />
			<Typography>Payout History</Typography>
			{data.currentStore.payouts.map(payout => (
				<PayoutRow key={payout.id} payout={payout} />
			))}
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	available: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8
	}
});

export default Payouts;
