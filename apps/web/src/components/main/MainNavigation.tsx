'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
	CircleUserIcon,
	LogOutIcon,
	SettingsIcon,
	ShoppingCartIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useAuthStore } from '@/state/auth-store';
import { useGuestCartStore } from '@/state/guest-cart-store';
import Logo from './Logo';
import SearchInput from '../SearchInput';
import { logout } from '@/data/requests';
import { useCartsQuery } from '@/data/queries';

const ProfileDropdown = () => {
	const { logOut } = useAuthStore();
	const router = useRouter();

	const handleLogOut = async () => {
		await logout();
		logOut();
		router.push('/');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='rounded-full'>
					<CircleUserIcon className='size-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild>
					<Link href='/profile/settings'>
						<SettingsIcon className='w-4 h-4' />
						Settings
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

const MainNavigation = () => {
	const { accessToken, toggleAuthModal } = useAuthStore();
	const isAuthenticated = Boolean(accessToken);
	const { cartIds } = useGuestCartStore();
	const { data: cartsData } = useCartsQuery({ enabled: isAuthenticated });

	const hasGuestCarts = cartIds.length > 0;
	const hasUserCarts = (cartsData?.carts?.length ?? 0) > 0;
	const showCartBadge = isAuthenticated ? hasUserCarts : hasGuestCarts;

	return (
		<div className='border-b bg-background py-3 px-4 mb-4 fixed top-0 w-full flex justify-between'>
			<nav className='flex flex-1 gap-4 items-center'>
				<Link
					className='text-muted-foreground hover:text-foreground transition-colors duration-200'
					href='/'
				>
					<Logo width={20} height={20} />
				</Link>
			</nav>

			<div className='flex-1 sm:flex hidden'>
				<SearchInput />
			</div>

			<div className='flex flex-1 justify-end items-center gap-3'>
				<Button asChild variant='ghost' size='icon'>
					<Link href='/cart'>
						<span className='relative inline-flex'>
							<ShoppingCartIcon className='size-5' />
							{showCartBadge ? (
								<Badge
									variant='destructive'
									className='absolute -top-1 -right-1 size-2 rounded-full p-0'
								/>
							) : null}
						</span>
					</Link>
				</Button>
				{accessToken ? (
					<ProfileDropdown />
				) : (
					<Button variant='outline' onClick={toggleAuthModal}>
						Sign in
					</Button>
				)}
			</div>
		</div>
	);
};

export default MainNavigation;
