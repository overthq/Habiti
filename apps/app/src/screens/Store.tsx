import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Screen } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

import StoreHeader from '../components/store/StoreHeader';
import StoreProducts from '../components/store/StoreProducts';

import { useStoreQuery } from '../data/queries';

import type { StoreStackParamList } from '../navigation/types';

const Store = () => {
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Main'>>();
	const { data, isLoading } = useStoreQuery(params.storeId);
	const [searchTerm, setSearchTerm] = React.useState<string>();
	const [activeCategory, setActiveCategory] = React.useState<string>();
	const { top } = useSafeAreaInsets();

	if (isLoading || !data?.store) return <ActivityIndicator />;

	return (
		<Screen style={{ paddingTop: top }}>
			<StoreHeader
				store={data.store}
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<Animated.View
				style={{ flex: 1, marginHorizontal: -16 }}
				layout={LinearTransition}
			>
				<StoreProducts
					store={data.store}
					activeCategory={activeCategory}
					searchTerm={searchTerm}
				/>
			</Animated.View>
		</Screen>
	);
};

export default Store;
