import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import { useProductQuery, useEditProductMutation } from '../types/api';
import { ModalStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const EditProduct: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<ModalStackParamList, 'Edit Product'>>();
	const [{ data }] = useProductQuery({ variables: { id: productId } });
	const [, editProduct] = useEditProductMutation();

	if (!data?.product) throw new Error('This item does not exist');

	const product = data.product;

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: product.name,
					description: product.description,
					unitPrice: product.unitPrice
				}}
				onSubmit={async values => {
					await editProduct({
						id: productId,
						input: values
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
		flex: 1,
		paddingHorizontal: 16
	}
});

export default EditProduct;
