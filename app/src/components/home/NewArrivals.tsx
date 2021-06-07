import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAppSelector } from '../../redux/store';
import { useNewArrivalsQuery, useStoresFollowedQuery } from '../../types/api';

const NewArrivals: React.FC = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);

	const [{ data: storesData }] = useStoresFollowedQuery({
		variables: { userId }
	});

	const [{ data }] = useNewArrivalsQuery({
		variables: {
			oneDayAgo: (new Date().getDate() - 2).toString(),
			storeIds: storesData?.store_followers.map(({ store_id }) => store_id)
		},
		pause: !storesData
	});

	if (!userId) throw new Error('User is not authenticated');

	return (
		<FlatList
			data={data?.items}
			renderItem={({ item }) => (
				<View>
					<View />
					<Text>{item.name}</Text>
				</View>
			)}
		/>
	);
};

export default NewArrivals;
