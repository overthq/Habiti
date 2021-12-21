import { IconType } from '../components/icons';
import { MainTabParamList } from '../types/navigation';

const icons: Record<keyof MainTabParamList, IconType> = {
	Overview: 'home',
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shoppingBag'
};

export const getIcon = (route: keyof MainTabParamList) => icons[route];
