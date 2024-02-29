import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import SettingsActiveStore from '../components/settings/SettingsActiveStore';
import SettingsTheme from '../components/settings/SettingsTheme';
import Settings from '../screens/Settings';
import { SettingsStackParamList } from '../types/navigation';

const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => (
	<SettingsStack.Navigator
		screenOptions={{ headerStatusBarHeight: 0 }}
		initialRouteName='SettingsList'
	>
		<SettingsStack.Screen
			name='SettingsList'
			component={Settings}
			options={{ title: 'Settings' }}
		/>
		<SettingsStack.Screen
			name='SettingsActiveStore'
			component={SettingsActiveStore}
			options={{ title: 'Active Store' }}
		/>
		<SettingsStack.Screen
			name='SettingsTheme'
			component={SettingsTheme}
			options={{ title: 'Theme' }}
		/>
	</SettingsStack.Navigator>
);

export default SettingsStackNavigator;
