import { Icon, IconType, themes } from '@habiti/components';

import { MainTabParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';

const icons: Record<keyof MainTabParamList, IconType> = {
	Home: 'home',
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shopping-bag'
};

export const getIcon = (route: keyof MainTabParamList) => icons[route];

export const tabScreenOptions =
	(themeName: 'light' | 'dark') =>
	({ route }: { route: RouteProp<MainTabParamList> }) => ({
		headerShown: false,
		tabBarActiveTintColor: themes[themeName].text.primary,
		tabBarInactiveTintColor: themes[themeName].text.tertiary,
		tabBarShowLabel: false,
		tabBarIcon: ({ color }: { color: string }) => (
			<Icon name={getIcon(route.name)} color={color} size={28} />
		)
	});
