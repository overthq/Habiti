import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { formatNaira } from '../utils/currency';

const Payouts = () => {
	const [{ data, fetching }] = useStorePayoutsQuery();
	useGoBack();

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<View>
			<Text>Payout History</Text>
			<Text>Manage previous payouts</Text>
			<View style={styles.payoutBar}>
				<View style={[styles.payoutTrack, { width: '50%' }]} />
			</View>
			{data.currentStore.payouts.map(payout => (
				<View key={payout.id}>
					<Text>{formatNaira(payout.amount)}</Text>
					<Text>{payout.createdAt}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	payoutBar: {
		width: '100%',
		height: 20,
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	payoutTrack: {
		backgroundColor: '#505050'
	}
});

export default Payouts;
