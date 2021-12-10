import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useCreateProductMutation } from '../types/api';
import Button from '../components/global/Button';
import { useAppSelector } from '../redux/store';

const AddProduct: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [, createProduct] = useCreateProductMutation();
	const { goBack } = useNavigation();

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: '',
					unitPrice: ''
				}}
				onSubmit={async values => {
					try {
						if (activeStore) {
							await createProduct({
								input: {
									name: values.name,
									description: values.description,
									storeId: activeStore,
									unitPrice: Number(values.unitPrice)
								}
							});
						}
						goBack();
					} catch (error) {
						console.log(error);
					}
				}}
			>
				{({ handleChange, handleBlur, handleSubmit }) => (
					<View>
						<View>
							<Text style={styles.label}>Name</Text>
							<TextInput
								placeholder='Name'
								placeholderTextColor='#696969'
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
								style={styles.input}
							/>
						</View>
						<View>
							<Text style={styles.label}>Description</Text>
							<TextInput
								placeholder='Description'
								placeholderTextColor='#696969'
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								style={[styles.input, styles.textarea]}
								multiline
								textAlignVertical='top'
							/>
						</View>
						<View>
							<Text style={styles.label}>Unit Price</Text>
							<TextInput
								placeholder='Unit price (NGN)'
								placeholderTextColor='#696969'
								onChangeText={handleChange('unitPrice')}
								onBlur={handleBlur('unitPrice')}
								style={styles.input}
								keyboardType='numeric'
							/>
						</View>
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
	},
	textarea: {
		paddingTop: 8,
		height: 80
	}
});

export default AddProduct;
