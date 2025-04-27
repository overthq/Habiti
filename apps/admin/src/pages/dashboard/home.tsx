import {
	Card,
	CardTitle,
	CardHeader,
	CardDescription
} from '@/components/ui/card';
import { useOverviewQuery } from '@/data/queries';

const Home = () => {
	const { data: overview } = useOverviewQuery();

	if (!overview) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardHeader>
						<CardDescription>Total Stores</CardDescription>
						<CardTitle>{overview.totalStores}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Orders</CardDescription>
						<CardTitle>{overview.totalOrders}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Products</CardDescription>
						<CardTitle>{overview.totalProducts}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Total Users</CardDescription>
						<CardTitle>{overview.totalUsers}</CardTitle>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
};

export default Home;
