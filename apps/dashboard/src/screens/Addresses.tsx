import React from 'react';
import { View, RefreshControl } from 'react-native';
import {
	EmptyState,
	Icon,
	Row,
	Screen,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';

import FAB from '../components/products/FAB';
import useGoBack from '../hooks/useGoBack';
import { useAddressesQuery } from '../data/queries';
import { AppStackParamList } from '../types/navigation';
import { Address } from '../data/types';

interface AddressListItemProps {
	address: Address;
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
	const { data, isLoading, refetch } = useAddressesQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!isLoading && refreshing) {
			setRefreshing(false);
		}
	}, [isLoading, refreshing]);

	useGoBack();

	const handleAddAddress = React.useCallback(() => {
		navigate('AddAddress');
	}, []);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleAddAddress}>
					<Icon name='plus' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: {
						type: 'sfSymbol',
						name: 'plus'
					},
					onPress: handleAddAddress
				}
			]
		});
	}, []);

	const handleAddressPress = (address: Address) => () => {
		navigate('Modals.EditAddress', {
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
		return <View />;
	}

	if (data?.addresses.length === 0) {
		return (
			<EmptyState
				title='No addresses found'
				description='You do not currently have any pickup addresses set up.'
				cta={{ text: 'Add address', action: handleAddAddress }}
			/>
		);
	}

	return (
		<Screen>
			<ScrollableScreen
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.text.secondary}
					/>
				}
			>
				<Spacer y={16} />
				{data?.addresses.map(address => (
					<AddressListItem
						key={address.id}
						address={address}
						onPress={handleAddressPress(address)}
					/>
				))}
			</ScrollableScreen>
			<FAB onPress={handleAddAddress} text='Add Address' />
		</Screen>
	);
};

export default Addresses;
