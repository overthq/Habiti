import { useQuery } from '@tanstack/react-query';

import dataService from '../services';

export const useUsersQuery = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => dataService.users.getUsers()
	});
};
