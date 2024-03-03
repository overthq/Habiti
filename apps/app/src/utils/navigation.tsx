import { Icon, IconType } from '@market/components';
import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { HomeTabParamList } from '../types/navigation';

export const getIcon = (routeName: keyof HomeTabParamList): IconType => {
	switch (routeName) {
		case 'For You':
			return 'home';
		case 'Explore':
			return 'search';
		case 'Carts':
			return 'shopping-bag';
		case 'Profile':
			return 'user';
		// case 'Notifications':
		// 	return ''
	}
};

export const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<HomeTabParamList> }) => ({
		headerShown: false,
		tabBarActiveTintColor: themeName === 'light' ? 'black' : 'white',
		tabBarInactiveTintColor: 'gray',
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={getIcon(route.name)} color={color} size={28} />
		)
	});
