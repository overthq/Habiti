import React from 'react';
import { View, Text } from 'react-native';

import TextButton from '../global/TextButton';

const LowStockProducts = () => {
	return (
		<View style={{ marginTop: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Text>Running low</Text>
				<TextButton>View all</TextButton>
			</View>
			<Text>These products have a l</Text>
		</View>
	);
};

export default LowStockProducts;
