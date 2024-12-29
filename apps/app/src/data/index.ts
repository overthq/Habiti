import APIService from './api';
import AuthService from './auth';
import { CardService } from './cards';
import CartService from './carts';
import OrderService from './orders';
import ProductService from './products';
import SearchService from './search';
import StoresService from './stores';
import UsersService from './users';

export class DataService {
	public auth: AuthService;
	public users: UsersService;
	public cards: CardService;
	public carts: CartService;
	public orders: OrderService;
	public products: ProductService;
	public stores: StoresService;
	public search: SearchService;

	constructor() {
		const api = new APIService();

		this.auth = new AuthService(api);
		this.users = new UsersService(api);
		this.cards = new CardService(api);
		this.carts = new CartService(api);
		this.orders = new OrderService(api);
		this.products = new ProductService(api);
		this.stores = new StoresService(api);
		this.search = new SearchService(api);
	}
}

const dataService = new DataService();

export default dataService;
