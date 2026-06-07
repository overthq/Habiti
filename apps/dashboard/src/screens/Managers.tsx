import React from 'react';
import { View, Pressable } from 'react-native';
import { Icon, ScrollableScreen } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import ManagerRow from '../components/managers/ManagerRow';
import Refresher from '../components/Refresher';
import useRefresh from '../hooks/useRefresh';
import { useStoreManagersQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';

const Managers = () => {
	const { data, isLoading, refetch } = useStoreManagersQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigate('Modal.AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, [setOptions, navigate]);

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
