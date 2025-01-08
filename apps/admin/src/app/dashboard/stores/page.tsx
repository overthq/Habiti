'use client';

import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useStoresQuery } from '@/data/queries/stores';

export default function StoresPage() {
	const { data, isLoading } = useStoresQuery();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Stores</h1>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Store Name</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={5} className='text-center'>
								Loading...
							</TableCell>
						</TableRow>
					) : (
						data?.stores?.map(store => (
							<TableRow key={store.id}>
								<TableCell>{store.name}</TableCell>
								<TableCell>
									<div className='flex gap-2'>
										<Button
											variant='ghost'
											size='sm'
											className='h-8 w-8 p-0'
											asChild
										>
											<Link href={`/dashboard/stores/${store.id}`}>
												<Edit className='h-4 w-4' />
											</Link>
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
	);
}
