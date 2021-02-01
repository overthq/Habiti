import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useManagedStoresQuery } from '../../types/api';
import { updatePreference } from '../../redux/preferences/actions';
import { useAppSelector } from '../../redux/store';

interface RowProps {
	name: string;
	isSelected: boolean;
	onSelectRow(): void;
}

// TODO: Set up icons with react-native-svg and replace v with check
const Row: React.FC<RowProps> = ({ name, isSelected, onSelectRow }) => (
	<TouchableOpacity style={styles.row} onPress={onSelectRow}>
		<Text>{name}</Text>
		<View>{isSelected && <Text>v</Text>}</View>
	</TouchableOpacity>
);

const SettingsActiveStore: React.FC = () => {
	const [{ data }] = useManagedStoresQuery();
	const dispatch = useDispatch();
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);

	const managers = data?.store_managers;

	const stores = managers?.map(({ store }) => store);

	const handleRowSelect = (id: string) => {
		dispatch(updatePreference({ activeStore: id }));
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={stores}
				keyExtractor={s => s.id}
				renderItem={({ item }) => (
					<Row
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
		alignItems: 'center'
	}
});

export default SettingsActiveStore;
