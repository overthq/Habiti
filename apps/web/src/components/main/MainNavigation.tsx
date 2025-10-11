import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface NavigationItemProps {
	isActive: boolean;
	href: string;
	children: React.ReactNode;
}

import { cn } from '@/lib/utils';
import { LogOutIcon, UserRoundIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useAuthStore } from '@/state/auth-store';
import Logo from './Logo';

const NavigationItem: React.FC<NavigationItemProps> = ({
	isActive,
	href,
	children
}) => {
	return (
		<Link
			href={href}
			className={cn(
				'font-medium',
				isActive
					? 'text-foreground'
					: 'text-muted-foreground hover:text-foreground transition-colors duration-200'
			)}
		>
			{children}
		</Link>
	);
};

const ProfileDropdown = () => {
	const { logOut } = useAuthStore();
	const router = useRouter();

	const handleLogOut = () => {
		logOut();
		router.push('/');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='rounded-full'>
					<UserRoundIcon className='size-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild>
					<Link href='/profile'>
						<UserRoundIcon className='w-4 h-4' />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleLogOut}>
					<LogOutIcon className='w-4 h-4' />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
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
];

const MainNavigation = () => {
	const pathname = usePathname();

	return (
		<div className='border-b bg-background py-3 px-4 mb-4 fixed top-0 w-full'>
			<nav className='mx-auto flex justify-between items-center'>
				<Link
					className='text-muted-foreground hover:text-foreground transition-colors duration-200'
					href='/'
				>
					<Logo width={20} height={20} />
				</Link>
				<ul className='max-w-4xl flex-1 flex items-center gap-4 pl-6'>
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
				<div className='flex items-center gap-2'>
					<ProfileDropdown />
				</div>
			</nav>
		</div>
	);
};

export default MainNavigation;
