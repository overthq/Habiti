import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import { useItemQuery, useUpdateItemMutation } from '../types/api';
import Button from '../components/global/Button';

const EditItem: React.FC = () => {
	const { params } = useRoute < RouteProp<ModalStackParamList, 'EditItem'>();

	const { itemId } = params;
	const [{ data }] = useItemQuery({ variables: { itemId } });
	const [, updateItem] = useUpdateItemMutation();

	if (!data?.items_by_pk) throw new Error('This item does not exist');

	const item = data.items_by_pk;

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: item.name,
					description: item.description,
					pricePerUnit: item.price_per_unit
				}}
				onSubmit={async values => {
					await updateItem({
						item: {
							name: values.name,
							description: values.description,
							price_per_unit: values.pricePerUnit
						}
					});
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<TextInput
							value={values.name}
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
						/>
						<TextInput
							value={values.description}
							onChangeText={handleChange('description')}
							onBlur={handleBlur('description')}
						/>
						<Button onPress={handleSubmit} text='Update Item' />
					</>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default EditItem;
