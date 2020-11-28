import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNewArrivalsQuery } from '../../types/api';

const NewArrivals = () => {
	const [{ data }] = useNewArrivalsQuery();

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
