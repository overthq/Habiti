import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNewArrivalsQuery } from '../../types/api';

const NewArrivals = () => {
	const oneDayAgo = React.useMemo(
		() => (new Date().getDate() - 2).toString(),
		[]
	);

	const [{ data }] = useNewArrivalsQuery({
		variables: { oneDayAgo, storeIds: [] }
	});

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
