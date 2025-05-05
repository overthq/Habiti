import React from 'react';
import { Screen } from '@habiti/components';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StoreProducts from '../components/store/StoreProducts';
import { useStoreQuery } from '../types/api';
import { StoreStackParamList } from '../types/navigation';
import StoreHeader from '../components/store/StoreHeader';
import Animated from 'react-native-reanimated';
import SearchStore from './SearchStore';

const Store: React.FC = () => {
	const { params } = useRoute<RouteProp<StoreStackParamList, 'Store.Main'>>();
	const [{ data, fetching }] = useStoreQuery({
		variables: { storeId: params.storeId }
	});
	const [searchTerm, setSearchTerm] = React.useState<string>();
	const [activeCategory, setActiveCategory] = React.useState<string>();

	if (fetching || !data?.store) return <ActivityIndicator />;

	return (
		<Screen>
			<SafeAreaView style={{ flex: 1 }}>
				<StoreHeader
					store={data.store}
					activeCategory={activeCategory}
					setActiveCategory={setActiveCategory}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
				<Animated.View style={{ flex: 1 }}>
					<StoreProducts
						store={data.store}
						activeCategory={activeCategory}
						searchTerm={searchTerm}
					/>
					<SearchStore searchTerm={searchTerm} />
				</Animated.View>
			</SafeAreaView>
		</Screen>
	);
};

export default Store;
