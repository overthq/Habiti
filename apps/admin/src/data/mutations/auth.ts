import { useMutation } from '@tanstack/react-query';

import dataService from '../services';
import { LoginBody } from '../services/auth';

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (body: LoginBody) => dataService.auth.login(body)
	});
};
