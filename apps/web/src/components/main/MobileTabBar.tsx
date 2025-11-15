import Link from 'next/link';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabRoutes = [
	{ href: '/home', label: 'Home', icon: Home },
	{ href: '/search', label: 'Search', icon: Search },
	{ href: '/carts', label: 'Carts', icon: ShoppingBag },
	{ href: '/profile', label: 'Profile', icon: User }
];

const MobileTabBar = () => {
	const pathname = usePathname();
	return (
		<div className='fixed bottom-0 left-0 right-0 bg-background border-t sm:hidden'>
			<div className='flex justify-between items-center px-4 py-4'>
				{tabRoutes.map(route => (
					<Link
						key={route.label}
						href={route.href}
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
