'use client';

import { Store, ShoppingCart, Users, Home } from 'lucide-react';
import Link from 'next/link';
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
		url: '/dashboard',
		icon: Home
	},
	{
		title: 'Stores',
		url: '/dashboard/stores',
		icon: Store
	},
	{
		title: 'Orders',
		url: '/dashboard/orders',
		icon: ShoppingCart
	},
	{
		title: 'Users',
		url: '/dashboard/users',
		icon: Users
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
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
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
