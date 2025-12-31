import { DataTable } from '../ui/data-table';
import { useStoreProductsQuery } from '@/data/queries';
import { type ColumnDef } from '@tanstack/react-table';
import { type Product } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import CreateProductDialog from './create-product-dialog';

const columns: ColumnDef<Product>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/products/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		header: 'Price',
		accessorKey: 'unitPrice',
		cell: ({ row }) => `${formatNaira(row.original.unitPrice)}`
	},
	{
		header: 'Quantity',
		accessorKey: 'quantity'
	},
	{
		header: 'Created At',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const StoreProducts = ({ storeId }: { storeId: string }) => {
	const { data } = useStoreProductsQuery(storeId);

	if (!data) return null;

	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<CreateProductDialog storeId={storeId} />
			</div>
			<DataTable
				columns={columns}
				data={data.products}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StoreProducts;
