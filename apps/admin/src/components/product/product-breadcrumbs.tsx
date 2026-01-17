import { Link } from 'react-router';

import { type Product } from '@/data/types';
import {
	ChevronRightIcon,
	CopyIcon,
	EyeIcon,
	MoreHorizontal,
	TrashIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useDeleteProductMutation } from '@/data/mutations';

interface ProductBreadcrumbsProps {
	product: Product;
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ product }) => {
	const deleteProductMutation = useDeleteProductMutation(product.id);

	const handleDeleteProduct = () => {
		deleteProductMutation.mutate();
	};

	return (
		<div className='flex items-center gap-2 border-b px-4 py-2 text-sm'>
			<Link to='/products' className='font-medium text-muted-foreground'>
				Products
			</Link>

			<ChevronRightIcon className='size-4' />

			<Link to={`/products/${product.id}`} className='font-medium'>
				{product.name}
			</Link>

			<Button variant='ghost' size='icon'>
				<EyeIcon />
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='start' className='w-48'>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(product.id)}
					>
						<CopyIcon className='size-3.5' />
						Copy product id
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleDeleteProduct}>
						<TrashIcon className='size-3.5' />
						Delete product
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default ProductBreadcrumbs;
