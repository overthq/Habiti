import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='flex-1 p-8 bg-gray-100 dark:bg-gray-800'>
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
}
