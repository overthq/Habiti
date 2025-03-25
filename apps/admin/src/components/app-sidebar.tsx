import { Store, ShoppingCart, Users, Home, Package } from 'lucide-react';
import { NavLink } from 'react-router';
import { usePathname } from 'next/navigation';

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
		url: '/',
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
	}
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarHeader />
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
