import React from 'react';
import { ActivityIndicator } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';
import { Icon, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useDeliveryAddressesQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';

const DeliveryAddress = () => {
	const { data, isLoading } = useDeliveryAddressesQuery();
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		const handleAddAddress = () =>
			navigation.navigate('Modal.AddDeliveryAddress');

		navigation.setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleAddAddress}>
					<Icon name='plus' size={24} />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: { type: 'sfSymbol', name: 'plus' },
					onPress: handleAddAddress
				}
			]
		});
	}, []);

	if (isLoading) {
		return <ActivityIndicator />;
	}

	return (
		<Screen style={{ paddingTop: 16, paddingHorizontal: 16 }}>
			{data?.addresses.map(address => (
				<Typography key={address.id}>{address.name}</Typography>
			))}
		</Screen>
	);
};

export default DeliveryAddress;
