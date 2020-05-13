import React from 'react';
import Select from 'react-select';
import { Form, Field, Formik } from 'formik';
import Modal, { ModalProps } from '../Modal';
import { useCreateItemMutation, ItemUnit } from '../../types';

const options = Object.values(ItemUnit).map(unit => ({
	label: unit,
	value: unit
}));

const CreateItemModal: React.FC<ModalProps> = ({ isOpen, close }) => {
	const [, createItem] = useCreateItemMutation();

	return (
		<Modal isOpen={isOpen} close={close}>
			<Formik
				initialValues={{
					name: '',
					pricePerUnit: 0,
					image: '',
					featured: false,
					unit: 'Kilograms' as ItemUnit
				}}
				onSubmit={async values => {
					createItem({
						input: { ...values, pricePerUnit: Number(values.pricePerUnit) }
					});
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
		</Modal>
	);
};

export default CreateItemModal;
