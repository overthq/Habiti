import {
	Store,
	ShoppingCart,
	Users,
	Home,
	Package,
	DollarSign
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';

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
			<SidebarFooter />
		</Sidebar>
	);
}
