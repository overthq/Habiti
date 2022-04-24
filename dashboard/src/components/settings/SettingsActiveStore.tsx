import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useManagedStoresQuery } from '../../types/api';
import { updatePreference } from '../../redux/preferences/actions';
import { useAppSelector } from '../../redux/store';
import useGoBack from '../../hooks/useGoBack';
import SettingSelectRow from './SettingSelectRow';

const SettingsActiveStore: React.FC = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data }] = useManagedStoresQuery({
		variables: { userId: userId as string }
	});
	const dispatch = useDispatch();
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	useGoBack();

	const stores = data?.user.managed.map(({ store }) => store);

	const handleRowSelect = (id: string) => {
		dispatch(updatePreference({ activeStore: id }));
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
						onSelectRow={() => handleRowSelect(item.id)}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#D3D3D3'
	}
});

export default SettingsActiveStore;
