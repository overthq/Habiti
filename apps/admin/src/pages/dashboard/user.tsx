import UpdateUserDialog from '@/components/user/update-user-dialog';
import UserOrders from '@/components/user/user-orders';
import { useUserQuery } from '@/data/queries';
import { useParams } from 'react-router';
import { Badge } from '@/components/ui/badge';
import CopyableText from '@/components/ui/copy';
import InlineMeta from '@/components/ui/inline-meta';

const User = () => {
	const { id } = useParams();
	const { data, isLoading } = useUserQuery(id ?? '');

	if (isLoading) return <div>Loading...</div>;

	if (!data) return <div>No data</div>;

	const { user } = data;

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>{user.name || 'User'}</h1>
					<InlineMeta
						items={[
							<span key='email' className='font-mono text-sm'>
								{user.email}
							</span>,
							<span key='status'>
								<Badge variant={user.suspended ? 'secondary' : 'default'}>
									{user.suspended ? 'Suspended' : 'Active'}
								</Badge>
							</span>,
							<span key='id'>
								<CopyableText value={user.id} />
							</span>
						]}
					/>
				</div>
				<UpdateUserDialog user={user} />
			</div>
			<UserOrders user={user} />
		</div>
	);
};

export default User;
