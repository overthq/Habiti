'use client';

import { Edit, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useUsersQuery } from '@/data/queries/users';

export default function UsersPage() {
	const { data, isLoading } = useUsersQuery();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Users</h1>
			</div>

			<div className='bg-white dark:bg-gray-900 shadow rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={6} className='text-center'>
									Loading...
								</TableCell>
							</TableRow>
						) : (
							data?.users?.map(user => (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{new Date(user.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<div className='flex gap-2'>
											<Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												variant='ghost'
												size='sm'
												className='h-8 w-8 p-0 text-destructive hover:text-destructive'
											>
												<Trash className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
