import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='flex-1 p-8'>
				<Outlet />
			</main>
		</SidebarProvider>
	);
};

export default DashboardLayout;
