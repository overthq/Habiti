import React from 'react';

const useAccessToken = () => {
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

	return { loading, accessToken, saveAccessToken, logOut };
};

export default useAccessToken;
