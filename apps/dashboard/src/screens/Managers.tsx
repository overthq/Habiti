import React from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { Icon, ScrollableScreen, Screen, useTheme } from '@habiti/components';
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
		<Screen>
			<ScrollableScreen
				style={styles.container}
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
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default Managers;
