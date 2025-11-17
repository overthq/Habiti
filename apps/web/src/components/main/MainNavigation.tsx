import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
	CircleUserIcon,
	LogOutIcon,
	ShoppingCartIcon,
	UserRoundIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useAuthStore } from '@/state/auth-store';
import Logo from './Logo';
import SearchInput from '../SearchInput';

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
					<CircleUserIcon className='size-5' />
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

const MainNavigation = () => {
	const { accessToken } = useAuthStore();

	return (
		<div className='border-b bg-background py-3 px-4 mb-4 fixed top-0 w-full flex justify-between'>
			<nav className='flex flex-1 gap-4 items-center'>
				<Link
					className='text-muted-foreground hover:text-foreground transition-colors duration-200'
					href={accessToken ? '/home' : '/'}
				>
					<Logo width={20} height={20} />
				</Link>
			</nav>

			<div className='flex-1 sm:flex hidden'>
				<SearchInput />
			</div>

			<div className='flex flex-1 justify-end items-center gap-2'>
				<Button asChild variant='ghost' size='icon'>
					<Link href='/carts'>
						<ShoppingCartIcon />
					</Link>
				</Button>

				<ProfileDropdown />
			</div>
		</div>
	);
};

export default MainNavigation;
