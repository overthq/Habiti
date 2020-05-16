import React from 'react';
import Select from 'react-select';
import { Form, Formik, Field } from 'formik';
import Modal, { ModalProps } from '../Modal';
import Button from '../Button';
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
					description: '',
					pricePerUnit: 0,
					featured: false,
					unit: ItemUnit.Kilogram
				}}
				onSubmit={async values => {
					createItem({
						input: { ...values, pricePerUnit: Number(values.pricePerUnit) }
					});
				}}
			>
				{({ values, handleChange, setFieldValue }) => (
					<Form style={{ display: 'flex', flexDirection: 'column' }}>
						<label style={{ marginBottom: 10 }}>
							Name
							<input
								name='name'
								type='text'
								onChange={handleChange}
								value={values.name}
							/>
						</label>
						<label style={{ marginBottom: 10 }}>
							<textarea name='description' onChange={handleChange} />
						</label>
						<label style={{ marginBottom: 10 }}>
							Price (per unit)
							<input
								name='pricePerUnit'
								type='number'
								onChange={handleChange}
								value={values.pricePerUnit}
							/>
						</label>
						<label style={{ marginBottom: 10 }}>
							<Field type='checkbox' name='featured' />
							Featured
						</label>
						<label style={{ marginBottom: 10 }}>
							<Select
								name='unit'
								value={options.find(option => option.value === values.unit)}
								onChange={(option: any) => setFieldValue('unit', option?.value)}
								options={options}
							/>
						</label>
						<Button color='#505050' textColor='#FFFFFF' type='submit'>
							Create Item
						</Button>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};

export default CreateItemModal;
