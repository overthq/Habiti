import { Icon, Screen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import ManagerRow from '../components/managers/ManagerRow';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useManagersQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Managers = () => {
	const [{ data, fetching }] = useManagersQuery();
	useGoBack();
	const userId = useStore(({ userId }) => userId);
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable
					style={{ marginRight: 16 }}
					onPress={() => navigate('AddManager')}
				>
					<Icon name='plus' />
				</Pressable>
			)
		});
	}, []);

	if (fetching || !data) {
		return <View />;
	}

	return (
		<Screen style={styles.container}>
			<View style={styles.managers}>
				{data.currentStore.managers.map(({ id, manager }) => (
					<ManagerRow key={id} manager={manager} you={userId === manager.id} />
				))}
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	managers: {
		borderRadius: 4
	}
});

export default Managers;
