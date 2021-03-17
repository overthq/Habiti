import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import { useItemQuery, useUpdateItemMutation } from '../types/api';
import { ModalStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const EditItem: React.FC = () => {
	const {
		params: { itemId }
	} = useRoute<RouteProp<ModalStackParamList, 'Edit Item'>>();
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
					unitPrice: item.unit_price
				}}
				onSubmit={async values => {
					await updateItem({
						item: {
							name: values.name,
							description: values.description,
							unitPrice: values.unitPrice
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
						<TextInput
							value={String(values.unitPrice)}
							onChangeText={handleChange('unitPrice')}
							onBlur={handleBlur('unitPrice')}
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
