import { DataTable } from '../ui/data-table';
import { useStoreProductsQuery } from '@/data/queries';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/data/types';
import { formatNaira } from '@/utils/format';

const columns: ColumnDef<Product>[] = [
	{
		header: 'Name',
		accessorKey: 'name'
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
		<div>
			<DataTable
				columns={columns}
				data={data.products}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StoreProducts;
