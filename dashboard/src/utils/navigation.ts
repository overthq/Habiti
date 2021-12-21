import { IconType } from '../components/icons';

export const getIcon = (routeName: string): IconType => {
	switch (routeName) {
		case 'Overview':
			return 'home';
		case 'Products':
			return 'tag';
		case 'Orders':
			return 'inbox';
		case 'Store':
			return 'shoppingBag';
	}
	throw new Error('Specified route does not exist.');
};
