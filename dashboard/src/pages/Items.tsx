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
	}

	tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	td {
		padding: 4px;
	}

	th {
		font-weight: 500;
		font-size: 16px;
		white-space: nowrap;
	}

	width: 100%;
	border-collapse: collapse;
	border-radius: 4px;
	border-spacing: 0;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	background-color: #ffffff;
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
				<Table style={{ marginTop: 20 }}>
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
