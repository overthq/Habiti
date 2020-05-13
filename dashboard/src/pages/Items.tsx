import React from 'react';
import { useStoreItemsQuery } from '../types';
import Page from '../components/Page';
import CreateItemModal from '../components/modals/CreateItemModal';
import Button from '../components/Button';

const Items = () => {
	const [{ data, fetching, error }] = useStoreItemsQuery();
	const [modalOpen, setModalOpen] = React.useState(false);

	return (
		<>
			<Page>
				<div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
					<h1 style={{ margin: 0 }}>Items</h1>
					<Button
						color='#505050'
						textColor='#D3D3D3'
						onClick={() => setModalOpen(true)}
					>
						Create Item
					</Button>
				</div>
				<table>
					<th>
						<td>Name</td>
						<td>Price</td>
						<td>Featured</td>
					</th>
					{data?.storeItems.map(({ name, pricePerUnit, featured }, index) => (
						<tr key={index}>
							<td>{name}</td>
							<td>{pricePerUnit}</td>
							<td>{featured.toString()}</td>
						</tr>
					))}
				</table>
			</Page>
			<CreateItemModal isOpen={modalOpen} close={() => setModalOpen(false)} />
		</>
	);
};

export default Items;
