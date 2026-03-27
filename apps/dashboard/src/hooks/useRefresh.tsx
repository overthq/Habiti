import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

interface UseRefreshOptions {
	refetch(): Promise<unknown>;
}

const useRefresh = ({ refetch }: UseRefreshOptions) => {
	const [isRefreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(async () => {
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

	return { isRefreshing, onRefresh };
};

export default useRefresh;
