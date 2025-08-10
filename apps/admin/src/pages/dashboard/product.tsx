import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CopyableText from '@/components/ui/copy';
import DescriptionList from '@/components/ui/description-list';
import InlineMeta from '@/components/ui/inline-meta';
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
			return { text: 'Out of Stock', variant: 'destructive' as const };
		} else if (quantity <= 10) {
			return { text: 'Low Stock', variant: 'secondary' as const };
		} else {
			return { text: 'In Stock', variant: 'default' as const };
		}
	};

	const stockStatus = getStockStatus(product.quantity);

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-3xl font-semibold tracking-tight'>
						{product.name}
					</h1>
					<InlineMeta
						items={[
							<span key='price' className='font-medium'>
								{formatNaira(product.unitPrice)}
							</span>,
							<span key='qty'>{product.quantity} in stock</span>,
							<span key='status'>
								<Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
							</span>,
							<span key='id'>
								<CopyableText value={product.id} />
							</span>
						]}
					/>
				</div>
				<UpdateProductDialog product={product} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Identifiers</CardTitle>
				</CardHeader>
				<CardContent>
					<InlineMeta
						items={[
							<span key='store'>
								Store: <CopyableText value={product.storeId} />
							</span>,
							<span key='created' className='font-mono text-sm'>
								Created {new Date(product.createdAt).toLocaleString()}
							</span>,
							<span key='updated' className='font-mono text-sm'>
								Updated {new Date(product.updatedAt).toLocaleString()}
							</span>
						]}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Description</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground whitespace-pre-wrap'>
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
