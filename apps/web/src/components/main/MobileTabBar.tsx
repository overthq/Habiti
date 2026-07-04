import { Link, useLocation } from '@tanstack/react-router';
import { Home, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabRoutes = [
	{ href: '/', label: 'Home', icon: Home },
	{ href: '/cart', label: 'Carts', icon: ShoppingBag },
	{ href: '/profile', label: 'Profile', icon: User }
] as const;

const MobileTabBar = () => {
	const pathname = useLocation({ select: loc => loc.pathname });
	return (
		<div className='fixed bottom-0 left-0 right-0 z-40 bg-background border-t sm:hidden'>
			<div className='flex justify-between items-center px-4 py-4'>
				{tabRoutes.map(route => (
					<Link
						key={route.label}
						to={route.href}
						className={cn(
							'flex-1 flex justify-center items-center',
							pathname !== route.href && 'text-muted-foreground'
						)}
					>
						<route.icon className='size-6' />
					</Link>
				))}
			</div>
		</div>
	);
};

export default MobileTabBar;
