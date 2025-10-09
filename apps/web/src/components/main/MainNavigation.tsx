import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavigationItemProps {
	isActive: boolean;
	href: string;
	children: React.ReactNode;
}

import { cn } from '@/lib/utils';

const NavigationItem: React.FC<NavigationItemProps> = ({
	isActive,
	href,
	children
}) => {
	return (
		<Link
			href={href}
			className={cn(
				'text-sm font-medium',
				!isActive && 'text-muted-foreground'
			)}
		>
			{children}
		</Link>
	);
};

const items = [
	{
		href: '/home',
		label: 'Home'
	},
	{
		href: '/orders',
		label: 'Orders'
	},
	{
		href: '/carts',
		label: 'Carts'
	}
	// {
	// 	href: '/profile',
	// 	label: 'Profile'
	// }
];

const MainNavigation = () => {
	const pathname = usePathname();

	return (
		<div className='bg-background py-3 px-4 mb-4 fixed top-0 w-full'>
			<nav className='mx-auto flex justify-between items-center'>
				<div>
					<Image
						src='/images/borderless-logo.svg'
						alt='Habiti'
						height={20}
						width={20}
					/>
				</div>
				<ul className='flex items-center gap-4'>
					{items.map(item => (
						<NavigationItem
							key={item.href}
							href={item.href}
							isActive={pathname === item.href}
						>
							{item.label}
						</NavigationItem>
					))}
				</ul>
				<div className='flex items-center gap-2'></div>
			</nav>
		</div>
	);
};

export default MainNavigation;
