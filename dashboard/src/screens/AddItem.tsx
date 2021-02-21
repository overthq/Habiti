import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useAddItemMutation } from '../types/api';
import Button from '../components/global/Button';
import { useAppSelector } from '../redux/store';

const AddItem: React.FC = () => {
	const activeStore = useAppSelector(
		({ preferences }) => preferences.activeStore
	);
	const [, addItem] = useAddItemMutation();

	const submit = (values: Record<string, any>) => {
		addItem({
			itemObject: {
				name: values.name,
				description: values.description,
				store_id: activeStore,
				unit_price: values.unitPrice
				// unit: values.unit
			}
		});
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					description: '',
					unitPrice: '',
					unit: ''
				}}
				onSubmit={submit}
			>
				{({ handleChange, handleBlur, handleSubmit }) => (
					<View>
						<TextInput
							placeholder='Item name'
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
							style={styles.input}
						/>
						<TextInput
							placeholder='Item description'
							onChangeText={handleChange('description')}
							onBlur={handleBlur('description')}
							style={[styles.input, styles.textarea]}
							multiline
						/>
						<TextInput
							placeholder='Price per unit (NGN)'
							onChangeText={handleChange('unitPrice')}
							onBlur={handleBlur('unitPrice')}
							style={styles.input}
							keyboardType='numeric'
						/>
						<Button text='Add Item' onPress={() => handleSubmit()} />
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
		paddingHorizontal: 8
	},
	input: {
		fontSize: 17,
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
