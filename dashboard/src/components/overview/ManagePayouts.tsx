import React from 'react';
import { Text, View } from 'react-native';
import { useStoreQuery } from '../../types/api';

const ManagePayouts = () => {
	const [{ data }] = useStoreQuery();

	return (
		<View>
			<Text>Payouts</Text>
		</View>
	);
};

export default ManagePayouts;
