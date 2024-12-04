import { useTheme } from '@habiti/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import CartsStack from './CartsStack';
import ExploreStack from './ExploreStack';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import { MainTabParamList } from '../types/navigation';
import { tabScreenOptions } from '../utils/navigation';

const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
	const { name } = useTheme();

	return (
		<MainTab.Navigator screenOptions={tabScreenOptions(name)}>
			<MainTab.Screen name='Main.ForYou' component={HomeStack} />
			<MainTab.Screen name='Main.Explore' component={ExploreStack} />
			<MainTab.Screen name='Main.Carts' component={CartsStack} />
			<MainTab.Screen name='Main.Profile' component={ProfileStack} />
		</MainTab.Navigator>
	);
};

export default MainTabNavigator;
