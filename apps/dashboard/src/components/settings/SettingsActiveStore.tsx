import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import SettingSelectRow from './SettingSelectRow';
import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';
import { useManagedStoresQuery } from '../../types/api';

const SettingsActiveStore: React.FC = () => {
	const { activeStore, setPreference } = useStore(state => ({
		activeStore: state.activeStore,
		setPreference: state.setPreference
	}));

	const [{ data }] = useManagedStoresQuery();
	useGoBack();

	const stores = data?.currentUser.managed.map(({ store }) => store);

	const handleRowSelect = (id: string) => () => {
		setPreference({ activeStore: id });
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={stores}
				keyExtractor={s => s.id}
				renderItem={({ item }) => (
					<SettingSelectRow
						name={item.name}
						isSelected={activeStore === item.id}
						onSelectRow={handleRowSelect(item.id)}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default SettingsActiveStore;
