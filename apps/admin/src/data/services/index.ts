import { APIService } from './api';
import { AuthService } from './auth';
import { OrderService } from './orders';
import { ProductService } from './products';
import { StoreService } from './stores';
import { UserService } from './users';

export class DataService {
	public orders: OrderService;
	public products: ProductService;
	public stores: StoreService;
	public users: UserService;
	public auth: AuthService;

	constructor() {
		const api = new APIService();

		this.orders = new OrderService(api);
		this.products = new ProductService(api);
		this.stores = new StoreService(api);
		this.users = new UserService(api);
		this.auth = new AuthService(api);
	}
}

const dataService = new DataService();

export default dataService;
