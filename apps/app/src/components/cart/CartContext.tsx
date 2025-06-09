import React from 'react';
import { CartQuery } from '../../types/api';

interface CartContextType {
	products: CartQuery['cart']['products'];
}

const CartContext = React.createContext<CartContextType>({
	products: []
});

export default CartContext;
