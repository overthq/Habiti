import { IconType } from '../components/Icon';
import { MainTabParamList } from '../types/navigation';

const icons: Record<keyof MainTabParamList, IconType> = {
	Overview: 'home',
	Products: 'tag',
	Orders: 'inbox',
	Store: 'shopping-bag'
};

export const getIcon = (route: keyof MainTabParamList) => icons[route];
