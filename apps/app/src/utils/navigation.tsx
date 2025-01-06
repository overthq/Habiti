import { Icon, IconType } from '@habiti/components';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';

import { AppStackParamList, MainTabParamList } from '../types/navigation';

export const getIcon = (routeName: keyof MainTabParamList): IconType => {
	switch (routeName) {
		case 'Main.ForYou':
			return 'home';
		case 'Main.Carts':
			return 'shopping-bag';
		case 'Main.Profile':
			return 'user';
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

export const navigateToProduct = (
	navigation: NavigationProp<AppStackParamList>,
	productId: string
) => {
	navigation.navigate('Product', { productId });
	// TODO: Add recently viewed product
};
