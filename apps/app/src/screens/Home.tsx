import { Screen, ScreenHeader } from '@habiti/components';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RecentOrders from '../components/home/RecentOrders';
import { useHomeQuery } from '../types/api';

const Home: React.FC = () => {
	const [{ fetching, data }] = useHomeQuery();
	const { top } = useSafeAreaInsets();

	if (fetching || !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Home' />
			<RecentOrders orders={data.currentUser.orders} />
		</Screen>
	);
};

export default Home;
