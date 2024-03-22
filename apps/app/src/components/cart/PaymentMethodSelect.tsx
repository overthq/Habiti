import React from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useCardsQuery } from '../../types/api';

interface PaymentMethodSelectProps {
	cards: any[];
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({ cards }) => {
	const [{ data, fetching }] = useCardsQuery();

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
