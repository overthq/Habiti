import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_dashboard')({
	component: DashboardLayout
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className='md:peer-data-[variant=inset]:rounded-sm'>
				<main className='flex-1 p-8'>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
