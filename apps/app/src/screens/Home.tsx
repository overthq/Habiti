import { Screen } from '@market/components';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import RecentOrders from '../components/home/RecentOrders';
import { useHomeQuery } from '../types/api';

const Home: React.FC = () => {
	const [{ fetching, data }] = useHomeQuery();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen>
			<RecentOrders orders={data.currentUser.orders} />
		</Screen>
	);
};

export default Home;
