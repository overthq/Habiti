import { IconType } from '../components/icons';

export const getIcon = (routeName: string): IconType => {
	switch (routeName) {
		case 'For You':
			return 'home';
		case 'Explore':
			return 'search';
		case 'Carts':
			return 'shoppingBag';
		case 'Profile':
			return 'user';
	}
	throw new Error('Specified route does not exist.');
};
