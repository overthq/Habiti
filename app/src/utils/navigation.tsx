import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { Icon, IconType } from '../components/Icon';
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
	}
};

export const tabScreenOptions = ({
	route
}: {
	route: RouteProp<HomeTabParamList>;
}) => ({
	headerShown: false,
	tabBarActiveTintColor: 'black',
	tabBarInactiveTintColor: 'gray',
	tabBarShowLabel: false,
	tabBarIcon: ({ color }: { color: string }) => (
		<Icon name={getIcon(route.name)} color={color} size={28} />
	)
});
