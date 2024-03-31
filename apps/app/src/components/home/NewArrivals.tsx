import { Typography } from '@market/components';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

const NewArrivals: React.FC = () => {
	const fetching = true;

	if (fetching) {
		return (
			<View>
				<Typography>Still fetching...</Typography>
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
					<Typography>{item.name}</Typography>
				</View>
			)}
		/>
	);
};

export default NewArrivals;
