import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

const RootLayout = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
			<Toaster />
		</QueryClientProvider>
	);
};

export default RootLayout;
