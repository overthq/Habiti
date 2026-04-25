import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { Toaster } from 'sonner';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import { ThemeProvider } from '@/components/theme-provider';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				title: 'Habiti Admin'
			}
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss
			}
		]
	}),
	component: RootComponent
});

function RootComponent() {
	return (
		<RootDocument>
			<ThemeProvider defaultTheme='dark' storageKey='admin-theme'>
				<Outlet />
				<Toaster richColors position='top-right' />
			</ThemeProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{ position: 'bottom-right' }}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />
						},
						TanStackQueryDevtools
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
