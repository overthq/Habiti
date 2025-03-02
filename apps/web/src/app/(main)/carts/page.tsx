import { gql, useQuery } from 'urql';

const CARTS_QUERY = gql`
  query Carts {
    currentUser {
      id
      carts {
        id

        store {
          id
            name
          }
        }

        products {
          cartId
          productId
          quantity

          product {
            id
            name
            unitPrice
          }
        }
      }
    }
  }
`;

const CartsPage = () => {
	const [{ data, fetching, error }] = useQuery({ query: CARTS_QUERY });

	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h1>Carts</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default CartsPage;
