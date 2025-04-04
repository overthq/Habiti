'use client';

import React from 'react';

interface AuthContextType {
	accessToken?: string;
	userId?: string;
	onLogin: (accessToken: string, userId: string) => void;
	onLogout: () => void;
	loading: boolean;
	loggedIn: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [accessToken, setAccessToken] = React.useState<string>();
	const [userId, setUserId] = React.useState<string>();
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const accessToken = window.localStorage.getItem('accessToken');
		const userId = window.localStorage.getItem('userId');

		if (accessToken && userId) {
			setAccessToken(accessToken);
			setUserId(userId);
		}

		setLoading(false);
	}, []);

	const handleLogin = (accessToken: string, userId: string) => {
		setAccessToken(accessToken);
		setUserId(userId);
		window.localStorage.setItem('accessToken', accessToken);
		window.localStorage.setItem('userId', userId);
	};

	const handleLogout = () => {
		setAccessToken(undefined);
		setUserId(undefined);
		window.localStorage.removeItem('accessToken');
		window.localStorage.removeItem('userId');
	};

	const loggedIn = React.useMemo(
		() => !!accessToken && !!userId,
		[accessToken, userId]
	);

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				userId,
				onLogin: handleLogin,
				onLogout: handleLogout,
				loading,
				loggedIn
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = React.useContext(AuthContext);

	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}

	return context;
};
