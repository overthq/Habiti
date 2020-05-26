import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartsContext } from '../contexts/CartsContext';

const Cart = () => {
	const { navigate } = useNavigation();
	const { params } = useRoute();
	const storeId = params?.storeId;

	const { carts } = React.useContext(CartsContext);

	const activeCart = carts.find(({ storeId: id }) => id === storeId);

	React.useEffect(() => {
		if (!activeCart) navigate('Carts');
	}, [activeCart]);

	return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Cart;
