import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

interface UseRefreshOptions {
	refetch(): Promise<unknown>;
}

const useRefresh = ({ refetch }: UseRefreshOptions) => {
	const [refreshing, setRefreshing] = React.useState(false);

	const refresh = React.useCallback(async () => {
		setRefreshing(true);

		try {
			await refetch();
		} finally {
			setRefreshing(false);
		}
	}, [refetch]);

	useFocusEffect(
		React.useCallback(() => {
			setRefreshing(false);
		}, [])
	);

	return { refreshing, refresh };
};

export default useRefresh;
