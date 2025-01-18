import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='flex-1 p-8 bg-gray-100 dark:bg-zinc-950'>
				{children}
			</main>
		</SidebarProvider>
	);
}
