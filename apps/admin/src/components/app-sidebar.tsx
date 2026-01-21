import {
	Store,
	ShoppingCart,
	Users,
	Home,
	Package,
	DollarSign,
	LogOut
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getCurrentAdmin } from '@/lib/utils';
import { useLogoutMutation } from '@/data/mutations';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const items = [
	{
		title: 'Home',
		url: '/home',
		icon: Home
	},
	{
		title: 'Stores',
		url: '/stores',
		icon: Store
	},
	{
		title: 'Orders',
		url: '/orders',
		icon: ShoppingCart
	},
	{
		title: 'Users',
		url: '/users',
		icon: Users
	},
	{
		title: 'Products',
		url: '/products',
		icon: Package
	},
	{
		title: 'Payouts',
		url: '/payouts',
		icon: DollarSign
	}
];

export function AppSidebar() {
	const { pathname } = useLocation();
	const [admin, setAdmin] = useState(getCurrentAdmin());
	const logoutMutation = useLogoutMutation();

	useEffect(() => {
		setAdmin(getCurrentAdmin());
	}, []);

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<Sidebar variant='inset'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5'
						>
							<Link to='/'>
								<span className='text-base font-semibold'>
									Habiti Dashboard
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton isActive={pathname === item.url} asChild>
										<NavLink to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{admin && (
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton size='lg' className='w-full'>
										<Avatar className='size-8 rounded-lg'>
											<AvatarFallback className='rounded-lg'>
												{admin.name?.[0]}
											</AvatarFallback>
										</Avatar>

										<span className='truncate'>{admin.name}</span>
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent side='right' align='end' className='w-56'>
									<div className='px-2 py-1.5 text-sm'>
										<div className='font-medium'>{admin.name}</div>
										<div className='text-muted-foreground truncate'>
											{admin.email}
										</div>
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleLogout}
										variant='destructive'
									>
										<LogOut className='mr-2 size-4' />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
