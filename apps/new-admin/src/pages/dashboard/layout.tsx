import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='flex-1 p-8 bg-gray-100 dark:bg-zinc-950'>
				<Outlet />
			</main>
		</SidebarProvider>
	);
};

export default DashboardLayout;
