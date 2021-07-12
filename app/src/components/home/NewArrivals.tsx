import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAppSelector } from '../../redux/store';
import { useNewArrivalsQuery } from '../../types/api';

const NewArrivals: React.FC = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);

	const [{ data }] = useNewArrivalsQuery({
		variables: {
			oneDayAgo: (new Date().getDate() - 2).toString(),
			userId
		}
	});

	const items = data?.store_followers
		.map(({ store }) => store.items)
		.reduce((acc, next) => [...acc, ...next], []);

	if (!userId) throw new Error('User is not authenticated');

	return (
		<FlatList
			data={items}
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
