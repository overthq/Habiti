import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { Formik } from 'formik';

const AddItem: React.FC = () => {
	const addItem = (values: Record<string, unknown>) => {
		console.log(values);
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					pricePerUnit: '',
					unit: ''
				}}
				onSubmit={addItem}
			>
				{({ handleChange, handleBlur, handleSubmit }) => (
					<View>
						<TextInput
							onChangeText={handleChange('name')}
							onBlur={handleBlur('name')}
						/>
						<TextInput
							onChangeText={handleChange('pricePerUnit')}
							onBlur={handleBlur('pricePerUnit')}
						/>
						<TouchableOpacity onPress={() => handleSubmit()}>
							<Text>Add Item</Text>
						</TouchableOpacity>
					</View>
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

export default AddItem;
