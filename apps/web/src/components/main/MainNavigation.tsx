import { Link, useNavigate } from '@tanstack/react-router';

import {
	CircleUserIcon,
	LogOutIcon,
	SettingsIcon,
	ShoppingCartIcon,
	UserIcon
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
import { useViewer } from '@/hooks/use-viewer';
import Logo from './Logo';
import SearchInput from '../SearchInput';
import { useLogoutMutation } from '@/data/mutations';
import { useCartsQuery } from '@/data/queries';

const ProfileDropdown = () => {
	const logoutMutation = useLogoutMutation();
	const navigate = useNavigate();

	const handleLogOut = async () => {
		await logoutMutation.mutateAsync();
		navigate({ to: '/' });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost'>
					<CircleUserIcon className='size-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild>
					<Link to='/profile'>
						<UserIcon className='w-4 h-4' />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to='/profile/settings'>
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
	const { toggleAuthModal } = useAuthStore();
	const { isSignedIn } = useViewer();
	const { data: cartsData } = useCartsQuery();

	const showCartBadge = (cartsData?.carts?.length ?? 0) > 0;

	return (
		<div className='border-b bg-background py-3 px-4 mb-4 fixed top-0 w-full z-40 flex flex-col md:flex-row md:justify-between gap-3'>
			<div className='flex flex-1 gap-4 items-center justify-between md:justify-start'>
				<nav className='flex gap-4 items-center'>
					<Link
						className='text-muted-foreground hover:text-foreground transition-colors duration-200'
						to='/'
					>
						<Logo width={20} height={20} />
					</Link>
				</nav>

				<div className='flex items-center gap-3 md:hidden'>
					<Button asChild variant='ghost' size='icon'>
						<Link to='/cart'>
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
					{isSignedIn ? (
						<ProfileDropdown />
					) : (
						<Button variant='outline' onClick={toggleAuthModal}>
							Sign in
						</Button>
					)}
				</div>
			</div>

			<div className='w-full md:grow md:max-w-3xl md:mx-auto'>
				<SearchInput />
			</div>

			<div className='hidden md:flex flex-1 justify-end items-center gap-3'>
				<Button asChild variant='ghost' size='icon'>
					<Link to='/cart'>
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
				{isSignedIn ? (
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
