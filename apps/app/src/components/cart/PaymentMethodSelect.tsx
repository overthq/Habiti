import React from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useCardsQuery } from '../../types/api';

const PaymentMethodSelect = () => {
	const [] = useCardsQuery();

	return (
		<View>
			<PaymentMethodOption />
		</View>
	);
};

const PaymentMethodOption = () => {
	return (
		<Pressable>
			<Animated.View />
		</Pressable>
	);
};

export default PaymentMethodSelect;
