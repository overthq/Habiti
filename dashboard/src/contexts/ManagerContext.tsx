import React from 'react';

interface ManagerContextValue {
	accessToken: string | null;
	saveAccessToken(token: string): void;
	logOut(): void;
}

export const ManagerContext = React.createContext<ManagerContextValue>({
	accessToken: null,
	saveAccessToken: () => {
		// noop
	},
	logOut: () => {
		// noop
	}
});

export const ManagerProvider: React.FC = ({ children }) => {
	const [loading, setLoading] = React.useState(true);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	React.useEffect(() => {
		try {
			const savedAccessToken = localStorage.getItem('accessToken');
			if (!savedAccessToken) return setAccessToken(null);
			setAccessToken(savedAccessToken);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (!accessToken) {
			localStorage.removeItem('accessToken');
			return;
		}
		localStorage.setItem('accessToken', accessToken);
	}, [accessToken]);

	const saveAccessToken = (token: string) =>
		localStorage.setItem('accessToken', token);

	const logOut = () => localStorage.removeItem('accessToken');

	return (
		<ManagerContext.Provider value={{ accessToken, saveAccessToken, logOut }}>
			{loading ? <p>Loading...</p> : children}
		</ManagerContext.Provider>
	);
};
