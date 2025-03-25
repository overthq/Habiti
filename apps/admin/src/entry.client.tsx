import React from 'react';
import ReactDOM from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const client = new QueryClient();

ReactDOM.hydrateRoot(
	document,
	<React.StrictMode>
		<QueryClientProvider client={client}>
			<HydratedRouter />
		</QueryClientProvider>
	</React.StrictMode>
);
