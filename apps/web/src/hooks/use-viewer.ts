import { useCurrentUserQuery } from '@/data/queries';

export const useViewer = () => {
	const { data, isLoading } = useCurrentUserQuery();

	const user = data?.user ?? null;

	return {
		user,
		isLoading,
		isSignedIn: Boolean(user && !user.isAnonymous)
	};
};
