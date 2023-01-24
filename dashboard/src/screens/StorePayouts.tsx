import React from 'react';
import { View } from 'react-native';
import useGoBack from '../hooks/useGoBack';

const StorePayouts = () => {
	useGoBack();

	return <View style={{ flex: 1 }}></View>;
};

export default StorePayouts;
