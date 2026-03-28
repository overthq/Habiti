import React from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import {
	SectionHeader,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useOrdersQuery } from '../../data/queries';
import { OrderStatus } from '../../data/types';
import { HomeStackParamList, MainTabParamList } from '../../navigation/types';

const AwaitingPickupOrders: React.FC = () => {
	const { data } = useOrdersQuery({ status: OrderStatus.ReadyForPickup });
	const { navigate } =
		useNavigation<NavigationProp<HomeStackParamList & MainTabParamList>>();
	const { theme } = useTheme();

	const orders = data?.orders ?? [];

	if (orders.length === 0) {
		return null;
	}

	const navigateToOrder = (orderId: string) => () => {
		navigate('Order', { orderId });
	};

	return (
		<View style={styles.container}>
			<SectionHeader title='Awaiting Pickup' />
			<Spacer y={4} />
			<FlatList
				data={orders}
				keyExtractor={o => o.id}
				renderItem={({ item }) => (
					<Pressable
						onPress={navigateToOrder(item.id)}
						style={[styles.card, { backgroundColor: theme.card.background }]}
					>
						<Typography weight='medium' ellipsize>
							{item.user.name}
						</Typography>
						<Typography variant='label'>{formatNaira(item.total)}</Typography>
					</Pressable>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				ListHeaderComponent={<View style={{ width: 16 }} />}
				ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16
	},
	card: {
		padding: 12,
		borderRadius: 10,
		width: 160
	}
});

export default AwaitingPickupOrders;
