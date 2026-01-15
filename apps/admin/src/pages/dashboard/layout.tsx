import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
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
};

export default DashboardLayout;
