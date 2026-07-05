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

import { AppStackParamList, StoreStackScreenProps } from '../navigation/types';

import { useCurrentStoreQuery } from '../data/queries';
import { useUpdateCurrentStoreMutation } from '../data/mutations';

const NoPayoutAccount = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, [navigate]);

	return (
		<Screen>
			<Typography weight='medium' size='large'>
				No payout account set up
			</Typography>
			<Spacer y={8} />
			<Typography variant='secondary'>
				To withdraw your earnings, you need to add a payout account.
			</Typography>
			<Spacer y={16} />
			<Button onPress={handleAddPayoutAccount} text='Add payout account' />
		</Screen>
	);
};

const StorePayouts: React.FC<StoreStackScreenProps<'Payouts'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useCurrentStoreQuery();
	const updateStoreMutation = useUpdateCurrentStoreMutation();
	const { theme } = useTheme();

	const removePayoutAccount = React.useCallback(async () => {
		await updateStoreMutation.mutateAsync({
			bankAccountNumber: undefined,
			bankCode: undefined
			// bankAccountReference: undefined
		});

		refetch();
	}, [updateStoreMutation, refetch]);

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
	}, [removePayoutAccount]);

	const handleAddPayoutAccount = React.useCallback(() => {
		navigation.navigate('Modal.AddPayoutAccount');
	}, [navigation]);

	if (isLoading) return <View />;

	if (!data?.store.bankAccountNumber) {
		return <NoPayoutAccount />;
	}

	return (
		<Screen>
			<View
				style={{
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
					{data?.store.bankAccountNumber}
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
