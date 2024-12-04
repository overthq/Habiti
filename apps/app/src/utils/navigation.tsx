import { Icon, IconType } from '@habiti/components';
import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { MainTabParamList } from '../types/navigation';

export const getIcon = (routeName: keyof MainTabParamList): IconType => {
	switch (routeName) {
		case 'Main.ForYou':
			return 'home';
		case 'Main.Explore':
			return 'search';
		case 'Main.Carts':
			return 'shopping-bag';
		case 'Main.Profile':
			return 'user';
		// case 'Notifications':
		// 	return ''
	}
};

export const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<MainTabParamList> }) => ({
		headerShown: false,
		tabBarActiveTintColor: themeName === 'light' ? 'black' : 'white',
		tabBarInactiveTintColor: 'gray',
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={getIcon(route.name)} color={color} size={28} />
		)
	});
