import { createFileRoute, Outlet } from '@tanstack/react-router';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export const Route = createFileRoute('/_marketing')({
	component: MarketingLayout
});

function MarketingLayout() {
	return (
		<main className='flex flex-col h-screen'>
			<Header />
			<Outlet />
			<Footer />
		</main>
	);
}
