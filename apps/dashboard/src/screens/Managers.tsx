import { Icon, ScrollableScreen } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable, RefreshControl } from 'react-native';

import ManagerRow from '../components/managers/ManagerRow';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useManagersQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Managers = () => {
	const [{ data, fetching }, refetch] = useManagersQuery();
	useGoBack();
	const userId = useStore(({ userId }) => userId);
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

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
		<ScrollableScreen
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={fetching} onRefresh={refetch} />
			}
		>
			{data.currentStore.managers.map(({ id, manager }) => (
				<ManagerRow key={id} manager={manager} you={userId === manager.id} />
			))}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default Managers;
