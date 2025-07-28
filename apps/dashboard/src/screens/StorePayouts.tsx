import React from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Screen, Spacer, Typography } from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import { useStoreQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// What settings should store owners be able to control from here?
// Account settings (account number, bank)
// Generate account name from these details

const NoPayoutAccount = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, []);

	return (
		<View style={{ padding: 16 }}>
			<Typography weight='medium' size='large'>
				No payout account set up
			</Typography>
			<Spacer y={8} />
			<Typography variant='secondary'>
				To withdraw your earnings, you need to add a payout account.
			</Typography>
			<Spacer y={16} />
			<Button onPress={handleAddPayoutAccount} text='Add payout account' />
		</View>
	);
};

const StorePayouts = () => {
	const [{ data, fetching }] = useStoreQuery();
	useGoBack();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, []);

	if (fetching) return <View />;

	if (!data?.currentStore.bankAccountNumber) {
		return <NoPayoutAccount />;
	}

	return (
		<Screen>
			<View>
				<Typography>{data?.currentStore.bankAccountNumber}</Typography>
				<Button
					onPress={handleAddPayoutAccount}
					text='Update account details'
				/>
			</View>
		</Screen>
	);
};

export default StorePayouts;
