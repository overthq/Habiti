import { Home, ShoppingBag, ShoppingCart } from 'lucide-react';
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
	return <Link href={href}>{children}</Link>;
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
		href: '/cart',
		icon: ShoppingCart
	}
];

const MainNavigation = () => {
	const pathname = usePathname();

	return (
		<div className='border-b py-4 mb-4'>
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
