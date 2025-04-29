import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductQuery } from '@/data/queries';
import UpdateProductDialog from '@/components/product/update-product-dialog';

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

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{product?.name}</h1>
				<UpdateProductDialog product={product} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Product Images</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						{product?.images.map(image => (
							<div
								key={image.id}
								className='relative aspect-square rounded-lg overflow-hidden'
							>
								<img
									src={image.path}
									alt={product.name}
									className='object-cover'
								/>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductPage;
