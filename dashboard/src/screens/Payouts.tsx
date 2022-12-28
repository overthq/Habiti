import React from 'react';
import { View, Text } from 'react-native';
import { useStorePayoutsQuery } from '../types/api';
import { formatNaira } from '../utils/currency';

const Payouts = () => {
	const [{ data, fetching }] = useStorePayoutsQuery();

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<View>
			<Text>Payout History:</Text>
			{data.currentStore.payouts.map(payout => (
				<View key={payout.id}>
					<Text>{formatNaira(payout.amount)}</Text>
					<Text>{payout.createdAt}</Text>
				</View>
			))}
		</View>
	);
};

export default Payouts;
