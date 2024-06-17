import { IconType } from '@habiti/components';

import { MainTabParamList } from '../types/navigation';

const icons: Record<keyof MainTabParamList, IconType> = {
	Home: 'home',
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shopping-bag'
};

export const getIcon = (route: keyof MainTabParamList) => icons[route];
