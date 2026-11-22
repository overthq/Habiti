import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCartsQuery } from '@/data/queries';
import type { UserCart } from '@habiti/data';

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
			{data.carts.map((cart: UserCart) => (
				<div key={cart.id}>
					<h2>{cart.store.name}</h2>
				</div>
			))}
		</div>
	);
};

export default CartSheet;
