import React from 'react';
import styled from 'styled-components';
import { useStoreItemsQuery } from '../types';
import Page from '../components/Page';
import CreateItemModal from '../components/modals/CreateItemModal';
import Button from '../components/Button';

const Table = styled.table`
	th,
	td {
		padding: 10px 5px;
		text-align: left;
		/* font-size: 0.75rem; */
	}

	th {
		text-transform: uppercase;
		font-weight: 500;
		font-size: 0.6875rem;
		white-space: nowrap;
	}

	width: 100%;
	border-collapse: collapse;
	border-radius: 4px;
	border-spacing: 0;
`;

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
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Price</th>
							<th>Featured</th>
						</tr>
					</thead>
					<tbody>
						{data?.storeItems.map(({ name, pricePerUnit, featured }, index) => (
							<tr key={index}>
								<td>{name}</td>
								<td>{pricePerUnit}</td>
								<td>{featured.toString()}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Page>
			<CreateItemModal isOpen={modalOpen} close={() => setModalOpen(false)} />
		</>
	);
};

export default Items;
