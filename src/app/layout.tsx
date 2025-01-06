import React from 'react';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
	title: 'Admin Dashboard',
	description: 'Admin dashboard for managing stores and products'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
