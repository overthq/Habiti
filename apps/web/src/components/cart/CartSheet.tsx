'use client';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCartsQuery } from '@/data/queries';
import { Cart } from '@/data/types';

const CartSheet = () => {
	return (
		<Sheet>
			<SheetTrigger>View your cart</SheetTrigger>
			<SheetContent>
				<h1>Cart</h1>
				<CartSheetContent />
			</SheetContent>
		</Sheet>
	);
};

const CartSheetContent = () => {
	const { data, isLoading } = useCartsQuery();

	if (isLoading || !data) return <div />;

	return (
		<div>
			{data.carts.map((cart: Cart) => (
				<div key={cart.id}>
					<h2>{cart.store.name}</h2>
					<p>{cart.total}</p>
				</div>
			))}
		</div>
	);
};

export default CartSheet;
