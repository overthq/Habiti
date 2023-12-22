import React from 'react';
import { View } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import StorePayoutsMain from '../components/store-payouts/StorePayoutsMain';

// What settings should store owners be able to control from here?
// Account settings (account number, bank)
// Generate account name from these details

// Do we want to store the reference information from Paystack alone,
// or the reference data and actual bank account information
// i.e. account number and bank code.

const StorePayouts = () => {
	const [{ data, fetching }] = useStoreQuery();
	useGoBack();

	if (fetching) return <View />;

	return (
		<StorePayoutsMain
			bankAccountNumber={data?.currentStore.bankAccountNumber}
			bankCode={data?.currentStore.bankCode}
		/>
	);
};

export default StorePayouts;
