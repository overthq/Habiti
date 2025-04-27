import { DataTable } from '../ui/data-table';
import { useStoreManagersQuery } from '@/data/queries';
import { ColumnDef } from '@tanstack/react-table';
import { StoreManager } from '@/data/types';

const columns: ColumnDef<StoreManager>[] = [
	{
		header: 'Name',
		accessorKey: 'name'
	},
	{
		header: 'Email',
		accessorKey: 'email'
	}
];

const StoreManagers = ({ storeId }: { storeId: string }) => {
	const { data } = useStoreManagersQuery(storeId);

	if (!data) return null;

	return (
		<div>
			<DataTable
				columns={columns}
				data={data.managers}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StoreManagers;
