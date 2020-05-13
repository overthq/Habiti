import React from 'react';
import { useStoreItemsQuery } from '../types';
import Page from '../components/Page';
import CreateItemModal from '../components/modals/CreateItemModal';

const Items = () => {
	const [{ data, fetching, error }] = useStoreItemsQuery();
	const [modalOpen, setModalOpen] = React.useState(false);

	return (
		<>
			<Page>
				<h1>Items</h1>
				<button onClick={() => setModalOpen(true)}>Create Item</button>
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
