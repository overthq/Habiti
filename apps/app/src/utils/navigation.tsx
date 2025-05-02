import { Icon, IconType, themes } from '@habiti/components';
import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { MainTabParamList } from '../types/navigation';

export const icons: Record<keyof MainTabParamList, IconType> = {
	'Main.ForYou': 'home',
	'Main.Carts': 'shopping-bag',
	'Main.Profile': 'user'
};

export const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<MainTabParamList> }) => ({
		headerShown: false,
		tabBarActiveTintColor: themes[themeName].text.primary,
		tabBarInactiveTintColor: themes[themeName].text.tertiary,
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={icons[route.name]} color={color} size={28} />
		)
	});
