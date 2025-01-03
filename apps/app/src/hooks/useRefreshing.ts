import React from 'react';

const useRefreshing = <T>(refetch: () => Promise<T>) => {
	const [refreshing, setRefreshing] = React.useState(false);
	const handleRefresh = React.useCallback(() => {
		setRefreshing(true);
		refetch().then(() => setRefreshing(false));
	}, []);

	return { refreshing, handleRefresh };
};

export default useRefreshing;
