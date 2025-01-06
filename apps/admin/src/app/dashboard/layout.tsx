import { Store, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen flex'>
			{/* Sidebar */}
			<aside className='w-64 bg-gray-900 text-white'>
				<div className='p-4'>
					<h1 className='text-2xl font-bold'>Admin Panel</h1>
				</div>
				<nav className='mt-8'>
					<div className='px-4 space-y-2'>
						<Link
							href='/dashboard/stores'
							className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800'
						>
							<Store className='h-5 w-5' />
							<span>Stores</span>
						</Link>
						<Link
							href='/dashboard/orders'
							className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800'
						>
							<ShoppingCart className='h-5 w-5' />
							<span>Orders</span>
						</Link>
						<Link
							href='/dashboard/users'
							className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800'
						>
							<Users className='h-5 w-5' />
							<span>Users</span>
						</Link>
					</div>
				</nav>
			</aside>

			{/* Main Content */}
			<main className='flex-1 p-8 bg-gray-100 dark:bg-gray-800'>
				{children}
			</main>
		</div>
	);
}
