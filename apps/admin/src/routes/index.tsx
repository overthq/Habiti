import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/')({
	component: IndexPage
});

function IndexPage() {
	const navigate = useNavigate();

	React.useEffect(() => {
		const accessToken =
			typeof window !== 'undefined'
				? localStorage.getItem('accessToken')
				: null;

		if (accessToken) {
			navigate({ to: '/home' });
		} else {
			navigate({ to: '/login' });
		}
	}, [navigate]);

	return null;
}
