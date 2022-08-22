import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useCreateProductMutation } from '../types/api';
import Button from '../components/global/Button';
import useGoBack from '../hooks/useGoBack';
import Input from '../components/global/Input';
import useStore from '../state';

const AddProduct: React.FC = () => {
	const activeStore = useStore(state => state.activeStore);
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
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							style={styles.input}
							autoCorrect={false}
						/>
						<Input
							label='Description'
							onChangeText={handleChange('description')}
							onBlur={handleBlur('description')}
							style={styles.input}
							textArea
							autoCorrect={false}
						/>
						<Input
							label='Unit Price'
							onChangeText={handleChange('unitPrice')}
							onBlur={handleBlur('unitPrice')}
							style={styles.input}
							keyboardType='numeric'
						/>
						<Input
							label='Quantity'
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
