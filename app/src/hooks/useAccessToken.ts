import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const useAccessToken = () => {
	const [loading, setLoading] = React.useState(true);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async () => {
			try {
				const savedToken = await AsyncStorage.getItem('accessToken');
				setAccessToken(savedToken);
			} catch (error) {
				setAccessToken(null);
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

	const logOut = () => setAccessToken(null);

	return { loading, accessToken, setAccessToken, logOut };
};

export default useAccessToken;
