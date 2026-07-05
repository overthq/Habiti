import React from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import {
	EmptyState,
	Icon,
	Row,
	ScrollableScreen,
	Typography,
	useTheme
} from '@habiti/components';
import { HeaderButton } from '@react-navigation/elements';

import useRefresh from '../hooks/useRefresh';
import { useDeliveryAddressesQuery } from '../data/queries';
import type { ProfileStackScreenProps } from '../navigation/types';
import { DeliveryAddress } from '../data/types';

interface AddressListItemProps {
	address: DeliveryAddress;
	onPress: () => void;
}

const AddressListItem: React.FC<AddressListItemProps> = ({
	address,
	onPress
}) => {
	return (
		<Row onPress={onPress} style={{ paddingVertical: 8 }}>
			<View>
				<Typography>{address.name}</Typography>
				<Typography variant='secondary' size='small'>
					{address.city}, {address.state}
				</Typography>
			</View>
		</Row>
	);
};

const Addresses: React.FC<ProfileStackScreenProps<'Profile.Addresses'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useDeliveryAddressesQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();

	const handleAddAddress = React.useCallback(() => {
		navigation.navigate('Modal.AddAddress');
	}, [navigation]);

	React.useLayoutEffect(() => {
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
	}, [handleAddAddress, navigation]);

	const handleAddressPress = (address: DeliveryAddress) => () => {
		navigation.navigate('Modal.EditAddress', {
			addressId: address.id,
			name: address.name,
			line1: address.line1,
			line2: address.line2,
			city: address.city,
			state: address.state,
			country: address.country,
			postcode: address.postcode
		});
	};

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	if (!data?.addresses.length) {
		return (
			<EmptyState
				title='No addresses found'
				description='You do not currently have any delivery addresses set up.'
				cta={{ text: 'Add address', action: handleAddAddress }}
			/>
		);
	}

	return (
		<ScrollableScreen
			style={{ marginHorizontal: -16 }}
			contentContainerStyle={{ padding: 0 }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			{data.addresses.map(address => (
				<AddressListItem
					key={address.id}
					address={address}
					onPress={handleAddressPress(address)}
				/>
			))}
		</ScrollableScreen>
	);
};

export default Addresses;
