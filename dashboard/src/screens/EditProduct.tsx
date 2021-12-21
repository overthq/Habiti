import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import { useProductQuery, useEditProductMutation } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import Button from '../components/global/Button';

const EditProduct: React.FC = () => {
	const {
		params: { productId }
	} = useRoute<RouteProp<AppStackParamList, 'Edit Product'>>();
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
					unitPrice: product.unitPrice,
					quantity: product.quantity
				}}
				onSubmit={async values => {
					await editProduct({
						id: productId,
						input: {
							...values,
							unitPrice: Number(values.unitPrice),
							quantity: Number(values.quantity)
						}
					});
				}}
			>
				{({ values, handleChange, handleBlur, handleSubmit }) => (
					<>
						<View>
							<Text style={styles.label}>Name</Text>
							<TextInput
								style={styles.input}
								placeholder='Name'
								placeholderTextColor='#696969'
								value={values.name}
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
							/>
						</View>
						<View>
							<Text style={styles.label}>Description</Text>
							<TextInput
								style={styles.input}
								placeholder='Description'
								placeholderTextColor='#696969'
								value={values.description}
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								multiline
								textAlignVertical='top'
							/>
						</View>
						<View>
							<Text style={styles.label}>Unit price</Text>
							<TextInput
								style={styles.input}
								placeholder='Unit price (NGN)'
								placeholderTextColor='#696969'
								value={String(values.unitPrice)}
								onChangeText={handleChange('unitPrice')}
								onBlur={handleBlur('unitPrice')}
							/>
						</View>
						<View>
							<Text style={styles.label}>Quantity</Text>
							<TextInput
								style={styles.input}
								placeholder='Quantity in stock'
								placeholderTextColor='#696969'
								value={String(values.quantity)}
								onChangeText={handleChange('quantity')}
								onBlur={handleBlur('quantity')}
								keyboardType='numeric'
							/>
						</View>
						<Button onPress={handleSubmit} text='Update Item' />
					</>
				)}
			</Formik>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 8,
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	label: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: 'bold'
	},
	input: {
		fontSize: 16,
		paddingLeft: 8,
		marginBottom: 10,
		height: 40,
		borderRadius: 4,
		backgroundColor: '#EDEDED',
		color: '#505050'
	}
});

export default EditProduct;
