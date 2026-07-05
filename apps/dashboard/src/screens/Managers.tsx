import React from 'react';
import { View, Pressable } from 'react-native';
import { Icon, ScrollableScreen } from '@habiti/components';

import ManagerRow from '../components/managers/ManagerRow';
import Refresher from '../components/Refresher';
import useRefresh from '../hooks/useRefresh';
import { useStoreManagersQuery } from '../data/queries';
import type { StoreStackScreenProps } from '../navigation/types';

const Managers: React.FC<StoreStackScreenProps<'Managers'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useStoreManagersQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigation.navigate('Modal.AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, [navigation]);

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
			}
		>
			{data.managers.map(manager => (
				<ManagerRow key={manager.id} manager={manager} you={false} />
			))}
		</ScrollableScreen>
	);
};

export default Managers;
