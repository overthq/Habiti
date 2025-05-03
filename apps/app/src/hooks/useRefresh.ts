import React from 'react';
import { OperationContext } from 'urql';

const useRefresh = ({
	fetching,
	refetch
}: {
	fetching: boolean;
	refetch: (options: Partial<OperationContext>) => void;
}) => {
	const [refreshing, setRefreshing] = React.useState(false);

	const refresh = React.useCallback(() => {
		setRefreshing(true);
		refetch({ requestPolicy: 'network-only' });
	}, [refetch]);

	React.useEffect(() => {
		if (!fetching && refreshing) {
			setRefreshing(false);
		}
	}, [fetching, refreshing]);

	return { refreshing, refresh };
};

export default useRefresh;
