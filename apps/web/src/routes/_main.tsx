import { createFileRoute, Outlet } from '@tanstack/react-router';
import MainNavigation from '@/components/main/MainNavigation';
import AuthDrawer from '@/components/AuthDrawer';
import { useSessionQuery } from '@/data/queries';

export const Route = createFileRoute('/_main')({
	component: MainLayout
});

function MainLayout() {
	const { isFetched } = useSessionQuery();

	if (!isFetched) {
		return null;
	}

	return (
		<div>
			<MainNavigation />
			<div className='max-w-6xl mx-auto md:pt-24 pb-18 sm:pb-8 px-4 pt-32'>
				<Outlet />
			</div>
			<AuthDrawer />
		</div>
	);
}
