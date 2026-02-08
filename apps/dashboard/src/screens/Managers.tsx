import React from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Icon, ScrollableScreen, Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import ManagerRow from '../components/managers/ManagerRow';
import useGoBack from '../hooks/useGoBack';
import { useStoreManagersQuery } from '../data/queries';
import { AppStackParamList } from '../types/navigation';

const Managers = () => {
	const { data, isLoading, refetch } = useStoreManagersQuery();
	const [refreshing, setRefreshing] = React.useState(false);
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();
	useGoBack();

	const refresh = React.useCallback(() => {
		setRefreshing(true);
		refetch();
	}, [refetch]);

	React.useEffect(() => {
		if (!isLoading && refreshing) setRefreshing(false);
	}, [isLoading, refreshing]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={() => navigate('AddManager')}>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (isLoading || !data) {
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
				{data.managers.map(manager => (
					<ManagerRow key={manager.id} manager={manager} you={false} />
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
