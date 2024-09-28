import React from 'react';

interface AuthContextType {
	accessToken?: string;
	userId?: string;
	onLogin: (accessToken: string, userId: string) => void;
	onLogout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
	accessToken: undefined,
	userId: undefined,
	onLogin: () => {},
	onLogout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [accessToken, setAccessToken] = React.useState<string>();
	const [userId, setUserId] = React.useState<string>();

	React.useEffect(() => {
		const accessToken = window.localStorage.getItem('accessToken');
		const userId = window.localStorage.getItem('userId');

		if (accessToken && userId) {
			setAccessToken(accessToken);
			setUserId(userId);
		}
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

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				userId,
				onLogin: handleLogin,
				onLogout: handleLogout
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
