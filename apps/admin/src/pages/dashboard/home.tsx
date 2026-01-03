import {
	Card,
	CardTitle,
	CardHeader,
	CardDescription
} from '@/components/ui/card';
import { useOverviewQuery } from '@/data/queries';
import { formatNaira } from '@/utils/format';

const Home = () => {
	const { data: overview } = useOverviewQuery();

	if (!overview) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-semibold'>Home</h1>
			</div>
			<div className='*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				<Card>
					<CardHeader>
						<CardDescription>Total Stores</CardDescription>
						<CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
							{overview.totalStores}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Orders</CardDescription>
						<CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
							{overview.totalOrders}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Products</CardDescription>
						<CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
							{overview.totalProducts}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Users</CardDescription>
						<CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
							{overview.totalUsers}
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Revenue</CardDescription>
						<CardTitle className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums'>
							{formatNaira(overview.totalRevenue)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
};

export default Home;
