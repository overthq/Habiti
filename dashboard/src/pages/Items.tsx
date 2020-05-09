import React from 'react';
import { Form, Field, Formik } from 'formik';
import Select from 'react-select';
import { useCreateItemMutation, useItemsQuery, ItemUnit } from '../types';
import { ManagerContext } from '../contexts/ManagerContext';
import Page from '../components/Page';

const options = Object.values(ItemUnit).map(unit => ({
	label: unit,
	value: unit
}));

const CreateItem = () => {
	const [, createItem] = useCreateItemMutation();
	const { manager } = React.useContext(ManagerContext);

	return (
		<Formik
			initialValues={{
				name: '',
				pricePerUnit: 0,
				image: '',
				featured: false,
				unit: 'Kilograms' as ItemUnit
			}}
			onSubmit={async values => {
				if (manager?.storeId) {
					createItem({
						storeId: manager.storeId,
						input: { ...values, pricePerUnit: Number(values.pricePerUnit) }
					});
				}
			}}
		>
			{({ handleChange, values, setFieldValue }) => (
				<Form>
					<label>
						Name
						<input
							name='name'
							type='text'
							onChange={handleChange}
							value={values.name}
						/>
					</label>
					<label>
						Price (per unit)
						<input
							name='price'
							type='number'
							onChange={handleChange}
							value={values.pricePerUnit}
						/>
					</label>
					<label>
						Image URL
						<input
							name='image'
							type='text'
							onChange={handleChange}
							value={values.image}
						/>
					</label>
					<label>
						<Field type='checkbox' name='featured' />
						Featured
					</label>
					<Select
						name='unit'
						value={options.find(option => option.value === values.unit)}
						onChange={(option: any) => setFieldValue('unit', option?.value)}
						options={options}
					/>
					<button type='submit'>Create Item</button>
				</Form>
			)}
		</Formik>
	);
};

const Items = () => {
	const [{ data, fetching, error }] = useItemsQuery();

	return (
		<Page>
			<CreateItem />
			<table>
				<th>
					<td>Name</td>
					<td>Price</td>
					<td>Featured</td>
				</th>
				{data?.items.map(({ name, pricePerUnit, featured }, index) => (
					<tr key={index}>
						<td>{name}</td>
						<td>{pricePerUnit}</td>
						<td>{featured.toString()}</td>
					</tr>
				))}
			</table>
		</Page>
	);
};

export default Items;
