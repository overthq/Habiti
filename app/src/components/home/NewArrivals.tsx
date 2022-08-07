import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';

const NewArrivals: React.FC = () => {
	const fetching = true;

	if (fetching) {
		return (
			<View>
				<Text>Still fetching...</Text>
			</View>
		);
	}

	const products: any[] = [];

	return (
		<FlashList
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
