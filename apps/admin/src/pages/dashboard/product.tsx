import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductQuery } from '@/data/queries';
import UpdateProductDialog from '@/components/product/update-product-dialog';
import { formatNaira } from '@/utils/format';

const ProductPage = () => {
	const { id } = useParams();
	const { data: productData, isLoading } = useProductQuery(id as string);

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	if (!productData?.product) {
		return <div>Product not found</div>;
	}

	const product = productData.product;

	const getStockStatus = (quantity: number) => {
		if (quantity === 0) {
			return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
		} else if (quantity <= 10) {
			return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
		} else {
			return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
		}
	};

	const stockStatus = getStockStatus(product.quantity);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{product.name}</h1>
				<UpdateProductDialog product={product} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-gray-500'>ID</p>
							<p className='font-mono text-sm'>{product.id}</p>
						</div>
						<div>
							<p className='text-gray-500'>Name</p>
							<p>{product.name}</p>
						</div>
						<div>
							<p className='text-gray-500'>Unit Price</p>
							<p className='font-semibold text-lg'>
								{formatNaira(product.unitPrice)}
							</p>
						</div>
						<div>
							<p className='text-gray-500'>Stock Status</p>
							<Badge className={stockStatus.color}>{stockStatus.text}</Badge>
						</div>
						<div>
							<p className='text-gray-500'>Quantity Available</p>
							<p className='font-semibold'>{product.quantity} units</p>
						</div>
						<div>
							<p className='text-gray-500'>Store ID</p>
							<p className='font-mono text-sm'>{product.storeId}</p>
						</div>
						<div>
							<p className='text-gray-500'>Created At</p>
							<p>{new Date(product.createdAt).toLocaleString()}</p>
						</div>
						<div>
							<p className='text-gray-500'>Updated At</p>
							<p>{new Date(product.updatedAt).toLocaleString()}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Description</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-gray-700 whitespace-pre-wrap'>
						{product.description}
					</p>
				</CardContent>
			</Card>

			{product.images.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Product Images ({product.images.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
							{product.images.map(image => (
								<div
									key={image.id}
									className='relative aspect-square rounded-lg overflow-hidden border'
								>
									<img
										src={image.path}
										alt={product.name}
										className='w-full h-full object-cover hover:scale-105 transition-transform duration-200'
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default ProductPage;
