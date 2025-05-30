import { Button, Screen } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import SettingSelectRow from './SettingSelectRow';
import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';
import { useManagedStoresQuery } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import { useShallow } from 'zustand/react/shallow';

const SettingsActiveStore: React.FC = () => {
	const { activeStore, setPreference } = useStore(
		useShallow(state => ({
			activeStore: state.activeStore,
			setPreference: state.setPreference
		}))
	);

	const [{ data }] = useManagedStoresQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const stores = data?.currentUser.managed.map(({ store }) => store);

	const handleRowSelect = (id: string) => () => {
		setPreference({ activeStore: id });
	};

	return (
		<Screen>
			{stores?.map(store => (
				<SettingSelectRow
					key={store.name}
					name={store.name}
					isSelected={activeStore === store.id}
					onSelectRow={handleRowSelect(store.id)}
				/>
			))}
			<View style={{ padding: 16 }}>
				<Button
					text='Create new store'
					onPress={() => navigate('Modal.CreateStore')}
				/>
			</View>
		</Screen>
	);
};

export default SettingsActiveStore;
