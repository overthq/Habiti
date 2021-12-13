import React from 'react';
import { View, Text, FlatList } from 'react-native';
// import { useAppSelector } from '../../redux/store';
// import { useNewArrivalsQuery } from '../../types/api';

const NewArrivals: React.FC = () => {
	// const userId = useAppSelector(({ auth }) => auth.userId);

	// const [{ data, fetching }] = useNewArrivalsQuery({
	// 	variables: {
	// 		oneDayAgo: (new Date().getDate() - 2).toString(),
	// 		userId
	// 	}
	// });

	const fetching = true;

	if (fetching) {
		return (
			<View>
				<Text>Still fetching...</Text>
			</View>
		);
	}

	const products: any[] = [];
	// const items = data?.store_followers
	// 	.map(({ store }) => store.items)
	// 	.reduce((acc, next) => [...acc, ...next], []);

	return (
		<FlatList
			data={products}
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
