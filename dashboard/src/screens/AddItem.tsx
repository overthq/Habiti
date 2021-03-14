import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useAddItemMutation } from '../types/api';
import Button from '../components/global/Button';
import { useAppSelector } from '../redux/store';

const AddItem: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [, addItem] = useAddItemMutation();
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
						await addItem({
							itemObject: {
								name: values.name,
								description: values.description,
								store_id: activeStore,
								unit_price: Number(values.unitPrice)
							}
						});
						goBack();
					} catch (error) {
						Alert.alert(error.message);
					}
				}}
			>
				{({ handleChange, handleBlur, handleSubmit }) => (
					<View>
						<View>
							<Text style={styles.label}>Name</Text>
							<TextInput
								placeholder='Item name'
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
								style={styles.input}
							/>
						</View>
						<View>
							<Text style={styles.label}>Description</Text>
							<TextInput
								placeholder='Item description'
								onChangeText={handleChange('description')}
								onBlur={handleBlur('description')}
								style={[styles.input, styles.textarea]}
								multiline
							/>
						</View>
						<View>
							<Text style={styles.label}>Unit Price</Text>
							<TextInput
								placeholder='Price per unit (NGN)'
								onChangeText={handleChange('unitPrice')}
								onBlur={handleBlur('unitPrice')}
								style={styles.input}
								keyboardType='numeric'
							/>
						</View>
						<Button text='Add Item' onPress={handleSubmit} />
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
		paddingHorizontal: 8,
		backgroundColor: '#FFFFFF'
	},
	label: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	input: {
		fontSize: 16,
		paddingLeft: 8,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#D3D3D3',
		marginBottom: 10,
		height: 40
	},
	textarea: {
		height: 80
	}
});

export default AddItem;
