import { canManageStore } from '../core/logic/permissions';
import { Resolver } from '../types/resolvers';

export const storeAuthorizedResolver =
	<T>(resolver: Resolver<T>) =>
	async (...args: Parameters<Resolver<T>>) => {
		const ctx = args[2];

		const isAuthorized = canManageStore(ctx);

		if (!isAuthorized) {
			throw new Error('Not authorized to manage store');
		}

		return resolver(...args);
	};
