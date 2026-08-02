import React from 'react';

interface UseRefreshOptions {
	refetch(): Promise<unknown>;
	isRefetching: boolean;
}

const useRefresh = ({ refetch, isRefetching }: UseRefreshOptions) => {
	const [pulled, setPulled] = React.useState(false);

	const onRefresh = React.useCallback(async () => {
		setPulled(true);

		try {
			await refetch();
		} finally {
			setPulled(false);
		}
	}, [refetch]);

	return { isRefreshing: pulled && isRefetching, onRefresh };
};

export default useRefresh;
