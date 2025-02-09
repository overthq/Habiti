import cardQueries from './cards';
import cartQueries from './carts';
import orderQueries from './orders';
import productQueries from './products';
import storeQueries from './stores';
import userQueries from './users';
import searchQueries from './search';

const Query = {
	...cardQueries.Query,
	...cartQueries.Query,
	...orderQueries.Query,
	...productQueries.Query,
	...storeQueries.Query,
	...userQueries.Query,
	...searchQueries.Query
};

const fieldResolvers = {
	Card: cardQueries.Card,
	Cart: cartQueries.Cart,
	Order: orderQueries.Order,
	Product: productQueries.Product,
	Store: storeQueries.Store,
	User: userQueries.User
};

export { Query, fieldResolvers };
