import React from 'react';
import { View } from 'react-native';

import { CartQuery } from '../../types/api';

interface StoreInfoProps {
	store: CartQuery['cart']['store'];
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
	return <View />;
};

export default StoreInfo;
