import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useGoBack from '../hooks/useGoBack';
import { useStorePayoutsQuery } from '../types/api';
import { formatNaira } from '../utils/currency';
import Button from '../components/global/Button';

const Payouts = () => {
	const [{ data, fetching }] = useStorePayoutsQuery();
	const { navigate } = useNavigation<any>();
	useGoBack();

	const handleNewPayout = () => {
		navigate('New Payout');
	};

	if (fetching || !data?.currentStore) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<Text>Manage previous payouts</Text>
			<Button
				style={styles.button}
				text='New payout'
				onPress={handleNewPayout}
			/>
			<View style={styles.bar}>
				<View style={[styles.track, { width: '50%' }]} />
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
		backgroundColor: '#FFFFFF',
		paddingTop: 8,
		paddingHorizontal: 16
	},
	button: {
		marginVertical: 8
	},
	bar: {
		width: '100%',
		height: 16,
		marginVertical: 8,
		borderRadius: 10,
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	track: {
		backgroundColor: '#505050',
		height: '100%'
	}
});

export default Payouts;
