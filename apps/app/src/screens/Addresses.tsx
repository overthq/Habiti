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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import useRefresh from '../hooks/useRefresh';
import { useDeliveryAddressesQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';
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

const Addresses = () => {
	const { data, isLoading, refetch } = useDeliveryAddressesQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();

	const handleAddAddress = React.useCallback(() => {
		navigate('Modal.AddAddress');
	}, [navigate]);

	React.useLayoutEffect(() => {
		setOptions({
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
	}, [handleAddAddress, setOptions]);

	const handleAddressPress = (address: DeliveryAddress) => () => {
		navigate('Modal.EditAddress', {
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
