import React from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Habiti Dashboard</title>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

const queryClient = new QueryClient();

export default function Root() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
			<Toaster />
		</QueryClientProvider>
	);
}
