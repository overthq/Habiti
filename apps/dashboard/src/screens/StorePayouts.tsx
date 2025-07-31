import React from 'react';
import { Alert, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
	Button,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import useGoBack from '../hooks/useGoBack';
import { useEditStoreMutation, useStoreQuery } from '../types/api';
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
	const [{ data, fetching }, refetch] = useStoreQuery();
	const [{ fetching: editing }, editStore] = useEditStoreMutation();
	const { theme } = useTheme();
	useGoBack();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleRemovePayoutAccount = React.useCallback(() => {
		Alert.alert(
			'Remove account',
			'Are you sure you want to remove your payout account?',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{ text: 'Remove', onPress: removePayoutAccount, style: 'destructive' }
			]
		);
	}, []);

	const removePayoutAccount = React.useCallback(async () => {
		const { error } = await editStore({
			input: {
				bankAccountNumber: undefined,
				bankCode: undefined
				// bankAccountReference: undefined
			}
		});

		if (error) {
			console.log('error', error);
		} else {
			refetch();
		}
	}, []);

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, []);

	if (fetching) return <View />;

	if (!data?.currentStore.bankAccountNumber) {
		return <NoPayoutAccount />;
	}

	return (
		<Screen>
			<View
				style={{
					marginTop: 16,
					marginHorizontal: 16,
					padding: 12,
					backgroundColor: theme.input.background,
					borderRadius: 6
				}}
			>
				<Typography variant='secondary' weight='medium'>
					Account
				</Typography>
				<Spacer y={8} />
				<Typography size='xxxlarge' weight='semibold'>
					{data?.currentStore.bankAccountNumber}
				</Typography>
				<Spacer y={12} />
				<View style={{ flexDirection: 'row', gap: 12 }}>
					<Button
						size='small'
						onPress={handleAddPayoutAccount}
						text='Update details'
						style={{ flexGrow: 1 }}
					/>
					<Button
						size='small'
						onPress={handleRemovePayoutAccount}
						text='Remove account'
						variant='secondary'
						style={{ flexGrow: 1 }}
					/>
				</View>
			</View>
		</Screen>
	);
};

export default StorePayouts;
