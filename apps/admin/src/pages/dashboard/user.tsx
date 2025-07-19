import UpdateUserDialog from '@/components/user/update-user-dialog';
import UserOrders from '@/components/user/user-orders';
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
						<p className='text-muted-foreground'>ID</p>
						<p>{user.id}</p>
					</div>
					<div>
						<p className='text-muted-foreground'>Name</p>
						<p>{user.name}</p>
					</div>
					<div>
						<p className='text-muted-foreground'>Email</p>
						<p>{user.email}</p>
					</div>
					<div>
						<p className='text-muted-foreground'>Status</p>
						<p>
							<span
								className={`px-2 py-1 rounded text-sm ${user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
							>
								{user.suspended ? 'Suspended' : 'Active'}
							</span>
						</p>
					</div>
					<div>
						<p className='text-muted-foreground'>Created At</p>
						<p>{new Date(user.createdAt).toLocaleString()}</p>
					</div>
					<div>
						<p className='text-muted-foreground'>Updated At</p>
						<p>{new Date(user.updatedAt).toLocaleString()}</p>
					</div>
				</div>
			</div>
			<UpdateUserDialog user={user} />
			<UserOrders user={user} />
		</div>
	);
};

export default User;
