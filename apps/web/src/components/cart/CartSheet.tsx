import { gql, useQuery } from 'urql';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const CARTS_QUERY = gql`
	query Carts {
		currentUser {
			id
			carts {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					id
					quantity
				}
				total
			}
		}
	}
`;

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
	const [{ data, fetching }] = useQuery({ query: CARTS_QUERY });

	if (fetching) return <div>Loading...</div>;

	return (
		<div>
			{data?.currentUser?.carts.map((cart: any) => (
				<div key={cart.id}>
					<h2>{cart.store.name}</h2>
					<p>{cart.total}</p>
				</div>
			))}
		</div>
	);
};

export default CartSheet;
