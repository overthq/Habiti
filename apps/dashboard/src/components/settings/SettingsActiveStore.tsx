import React from 'react';
import { View } from 'react-native';
import { Button, Screen } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import SettingSelectRow from './SettingSelectRow';
import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';
import { useManagedStoresQuery } from '../../data/queries';
import { switchStore } from '../../data/requests';
import { AppStackParamList } from '../../navigation/types';
import { useShallow } from 'zustand/react/shallow';

const SettingsActiveStore: React.FC = () => {
	const { activeStore, setPreference, logIn } = useStore(
		useShallow(state => ({
			activeStore: state.activeStore,
			setPreference: state.setPreference,
			logIn: state.logIn
		}))
	);

	const { data } = useManagedStoresQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	useGoBack();

	const stores = data?.stores;

	const handleRowSelect = (id: string) => async () => {
		try {
			const { accessToken } = await switchStore(id);
			logIn(accessToken);
			setPreference({ activeStore: id });
		} catch {
			// TODO: Handle error (show toast, etc.)
		}
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
