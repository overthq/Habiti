import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useManagedStoresQuery } from '../../types/api';
import useGoBack from '../../hooks/useGoBack';
import SettingSelectRow from './SettingSelectRow';
import useStore from '../../state';

const SettingsActiveStore: React.FC = () => {
	const { userId, activeStore, setPreference } = useStore(state => ({
		userId: state.userId,
		activeStore: state.activeStore,
		setPreference: state.setPreference
	}));

	const [{ data }] = useManagedStoresQuery({
		variables: { userId: userId as string }
	});
	useGoBack();

	const stores = data?.user.managed.map(({ store }) => store);

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
