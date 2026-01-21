import { useParams, Link } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UpdateProductDialog from '@/components/product/update-product-dialog';

import { useProductQuery } from '@/data/queries';

import { formatNaira } from '@/utils/format';
import ProductBreadcrumbs from '@/components/product/product-breadcrumbs';

const getStockStatus = (quantity: number) => {
	if (quantity === 0) {
		return { text: 'Out of Stock', variant: 'destructive' as const };
	} else if (quantity <= 10) {
		return { text: 'Low Stock', variant: 'secondary' as const };
	} else {
		return { text: 'In Stock', variant: 'default' as const };
	}
};

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useProductQuery(id as string);

	if (isLoading || !id || !data?.product) return null;

	const { product } = data;

	const stockStatus = getStockStatus(product.quantity);

	return (
		<div className='-m-8'>
			<ProductBreadcrumbs product={product} />

			<div className='space-y-6 px-4 py-8 mx-auto max-w-6xl'>
				<h1 className='text-2xl font-semibold'>{product.name}</h1>

				<div className='my-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-4 text-sm'>
					<p className='font-medium text-muted-foreground'>Price</p>
					<p>{formatNaira(product.unitPrice)}</p>

					<p className='font-medium text-muted-foreground'>Quantity</p>
					<p>{product.quantity}</p>

					<p className='font-medium text-muted-foreground'>Status</p>
					<Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>

					<p className='font-medium text-muted-foreground'>Store</p>
					<Link to={`/stores/${product.storeId}`}>{product.store.name}</Link>
				</div>

				<UpdateProductDialog product={product} />

				<div className='space-y-2'>
					<p className='font-medium text-muted-foreground'>Description</p>
					<p>{product.description}</p>
				</div>

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
		</div>
	);
};

export default ProductPage;
