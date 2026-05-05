import React from 'react';
import { View, Pressable, RefreshControl } from 'react-native';
import { Icon, ScrollableScreen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import ManagerRow from '../components/managers/ManagerRow';
import useRefresh from '../hooks/useRefresh';
import { useStoreManagersQuery } from '../data/queries';
import { AppStackParamList } from '../navigation/types';

const Managers = () => {
	const { data, isLoading, refetch } = useStoreManagersQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch });
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigate('Modal.AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={onRefresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			{data.managers.map(manager => (
				<ManagerRow key={manager.id} manager={manager} you={false} />
			))}
		</ScrollableScreen>
	);
};

export default Managers;
