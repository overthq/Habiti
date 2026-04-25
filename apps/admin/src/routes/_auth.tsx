import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
	component: AuthLayout
});

function AuthLayout() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
