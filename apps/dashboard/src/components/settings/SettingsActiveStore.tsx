import { Button } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import SettingSelectRow from './SettingSelectRow';
import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';
import { useManagedStoresQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

const SettingsActiveStore: React.FC = () => {
	const { activeStore, setPreference } = useStore(state => ({
		activeStore: state.activeStore,
		setPreference: state.setPreference
	}));

	const [{ data }] = useManagedStoresQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const stores = data?.currentUser.managed.map(({ store }) => store);

	const handleRowSelect = (id: string) => () => {
		setPreference({ activeStore: id });
	};

	return (
		<View style={styles.container}>
			{stores?.map(store => (
				<SettingSelectRow
					name={store.name}
					isSelected={activeStore === store.id}
					onSelectRow={handleRowSelect(store.id)}
				/>
			))}
			{/* <Spacer y={16} /> */}
			<View style={{ padding: 16 }}>
				<Button
					text='Create new store'
					onPress={() => navigate('Modal.CreateStore')}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default SettingsActiveStore;
