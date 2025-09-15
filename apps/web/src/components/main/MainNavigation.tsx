import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItemProps {
	isActive: boolean;
	href: string;
	children: React.ReactNode;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
	isActive,
	href,
	children
}) => {
	return (
		<Link
			href={href}
			className={`p-2 rounded-lg transition-colors ${
				isActive ? 'bg-muted' : 'hover:bg-muted/50 opacity-70 hover:opacity-100'
			}`}
		>
			{children}
		</Link>
	);
};

const items = [
	{
		href: '/home',
		icon: Home
	},
	{
		href: '/orders',
		icon: ShoppingBag
	},
	{
		href: '/carts',
		icon: ShoppingCart
	},
	{
		href: '/profile',
		icon: User
	}
];

const MainNavigation = () => {
	const pathname = usePathname();

	return (
		<div className='border-b bg-background py-2 mb-4 fixed top-0 w-full'>
			<nav className='container mx-auto'>
				<ul className='flex justify-center items-center gap-8'>
					{items.map(item => (
						<NavigationItem
							key={item.href}
							href={item.href}
							isActive={pathname === item.href}
						>
							<item.icon />
						</NavigationItem>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default MainNavigation;
