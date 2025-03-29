import { useUserQuery } from '@/data/queries';
import { useParams } from 'react-router';

const User = () => {
	const { id } = useParams();
	const { data, isLoading } = useUserQuery(id ?? '');

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return <div>User</div>;
};

export default User;
