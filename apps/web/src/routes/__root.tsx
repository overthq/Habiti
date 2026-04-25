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
import ThemeProvider from '@/components/ThemeProvider';

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
				title: 'Habiti'
			}
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss
			},
			{
				rel: 'icon',
				type: 'image/png',
				media: '(prefers-color-scheme: light)',
				href: '/images/favicon-light.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				media: '(prefers-color-scheme: dark)',
				href: '/images/favicon-dark.png'
			}
		]
	}),
	component: RootComponent
});

function RootComponent() {
	return (
		<RootDocument>
			<ThemeProvider>
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
