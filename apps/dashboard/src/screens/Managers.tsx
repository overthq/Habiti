import { Icon, ScrollableScreen, Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';

import ManagerRow from '../components/managers/ManagerRow';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useManagersQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import { useShallow } from 'zustand/react/shallow';

const Managers = () => {
	const [{ data, fetching }, refetch] = useManagersQuery();
	const [refreshing, setRefreshing] = React.useState(false);
	useGoBack();
	const userId = useStore(useShallow(({ userId }) => userId));
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();

	const refresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!fetching && refreshing) setRefreshing(false);
	}, [fetching, refreshing]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigate('AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data) {
		return <View />;
	}

	return (
		<Screen>
			<ScrollableScreen
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
			>
				{data.currentStore.managers.map(({ manager }) => (
					<ManagerRow
						key={manager.id}
						manager={manager}
						you={userId === manager.id}
					/>
				))}
			</ScrollableScreen>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default Managers;
