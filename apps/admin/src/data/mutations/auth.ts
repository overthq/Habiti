import { useMutation } from '@tanstack/react-query';

import dataService from '../services';
import { CreateAdminBody, LoginBody } from '../services/auth';

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (body: LoginBody) => dataService.auth.login(body)
	});
};

export const useCreateAdminMutation = () => {
	return useMutation({
		mutationFn: (body: CreateAdminBody) => dataService.auth.createAdmin(body)
	});
};
