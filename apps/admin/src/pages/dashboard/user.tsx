import { useUserQuery } from '@/data/queries';
import { useParams } from 'react-router';

const User = () => {
	const { id } = useParams();
	const { data, isLoading } = useUserQuery(id ?? '');

	if (isLoading) return <div>Loading...</div>;

	if (!data) return <div>No data</div>;

	const { user } = data;

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>User</h1>
			</div>
			<div>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<p className='text-gray-500'>ID</p>
						<p className='font-medium'>{user.id}</p>
					</div>
					<div>
						<p className='text-gray-500'>Name</p>
						<p className='font-medium'>{user.name}</p>
					</div>
					<div>
						<p className='text-gray-500'>Email</p>
						<p className='font-medium'>{user.email}</p>
					</div>
					<div>
						<p className='text-gray-500'>Status</p>
						<p className='font-medium'>
							<span
								className={`px-2 py-1 rounded text-sm ${user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
							>
								{user.suspended ? 'Suspended' : 'Active'}
							</span>
						</p>
					</div>
					<div>
						<p className='text-gray-500'>Created At</p>
						<p className='font-medium'>
							{new Date(user.createdAt).toLocaleString()}
						</p>
					</div>
					<div>
						<p className='text-gray-500'>Updated At</p>
						<p className='font-medium'>
							{new Date(user.updatedAt).toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default User;
