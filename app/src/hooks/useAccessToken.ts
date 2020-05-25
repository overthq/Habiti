import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const useAccessToken = () => {
	const [loading, setLoading] = React.useState(true);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async () => {
			try {
				const savedAccessToken = await AsyncStorage.getItem('accessToken');
				if (!savedAccessToken) return setAccessToken(null);
				setAccessToken(savedAccessToken);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	React.useEffect(() => {
		if (!accessToken) {
			AsyncStorage.removeItem('accessToken');
			return;
		}
		AsyncStorage.setItem('accessToken', accessToken);
	}, [accessToken]);

	const saveAccessToken = (token: string) =>
		AsyncStorage.setItem('accessToken', token);

	const logOut = () => setAccessToken(null);

	return { loading, accessToken, saveAccessToken, logOut };
};

export default useAccessToken;
