import React from 'react';
import { ActivityIndicator } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';
import { Icon, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useDeliveryAddressesQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const DeliveryAddress = () => {
	const [{ data, fetching }] = useDeliveryAddressesQuery();
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	useGoBack();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton
					onPress={() => {
						navigation.navigate('Modal.AddDeliveryAddress');
					}}
				>
					<Icon name='plus' size={24} />
				</HeaderButton>
			)
		});
	}, []);

	if (fetching) {
		return <ActivityIndicator />;
	}

	return (
		<Screen style={{ paddingTop: 16, paddingHorizontal: 16 }}>
			{data?.currentUser.addresses.map(address => (
				<Typography key={address.id}>{address.name}</Typography>
			))}
		</Screen>
	);
};

export default DeliveryAddress;
