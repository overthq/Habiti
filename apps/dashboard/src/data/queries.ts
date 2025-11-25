import { useQuery } from '@tanstack/react-query';
import { refreshAuthTokens } from '../utils/refreshManager';

export const useAuthRefreshQuery = () => {
	return useQuery({
		queryKey: ['auth', 'refresh'],
		queryFn: () => refreshAuthTokens(),
		retry: false
	});
};
