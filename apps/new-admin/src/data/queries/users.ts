import { useQuery } from '@tanstack/react-query';

import dataService from '../services';

export const useUsersQuery = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => dataService.users.getUsers()
	});
};

export const useUserQuery = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: () => dataService.users.getUser(id),
		enabled: !!id
	});
};
