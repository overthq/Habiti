import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useCreateProductMutation } from '../types/api';
import Button from '../components/global/Button';
import { useAppSelector } from '../redux/store';
import useGoBack from '../hooks/useGoBack';
import Input from '../components/global/Input';

const AddProduct: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [, createProduct] = useCreateProductMutation();
	const { goBack } = useNavigation();
	useGoBack();

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: '',
					unitPrice: '',
					quantity: ''
				}}
				onSubmit={async values => {
					try {
						if (activeStore) {
							await createProduct({
								input: {
									name: values.name,
									description: values.description,
									storeId: activeStore,
									unitPrice: Number(values.unitPrice) * 100,
									quantity: Number(values.quantity)
								}
							});
							goBack();
						}
					} catch (error) {
						console.log(error);
					}
				}}
			>
				{({ handleChange, handleBlur, handleSubmit }) => (
					<View>
						<Input
							label='Name'
							placeholder='Name'
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							style={styles.input}
						/>
						<Input
							label='Description'
							placeholder='Description'
							onChangeText={handleChange('description')}
							onBlur={handleBlur('description')}
							style={styles.input}
							textArea
						/>
						<Input
							label='Unit Price'
							placeholder='Unit price (NGN)'
							onChangeText={handleChange('unitPrice')}
							onBlur={handleBlur('unitPrice')}
							style={styles.input}
							keyboardType='numeric'
						/>
						<Input
							label='Quantity'
							placeholder='Quantity in stock'
							onChangeText={handleChange('quantity')}
							onBlur={handleBlur('quantity')}
							style={styles.input}
							keyboardType='numeric'
						/>
						<Button text='Add Product' onPress={handleSubmit} />
					</View>
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
	input: {
		marginBottom: 10
	}
});

export default AddProduct;
