import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsStackParamList } from '../types/navigation';
import Settings from '../screens/Settings';
import SettingsActiveStore from '../components/settings/SettingsActiveStore';

const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => (
	<SettingsStack.Navigator screenOptions={{ headerStatusBarHeight: 0 }}>
		<SettingsStack.Screen name='SettingsList' component={Settings} />
		<SettingsStack.Screen
			name='SettingsActiveStore'
			component={SettingsActiveStore}
			options={{ title: 'Active Store' }}
		/>
	</SettingsStack.Navigator>
);

export default SettingsStackNavigator;
