import { APIService } from './api';
import { OrderService } from './orders';
import { ProductService } from './products';
import { StoreService } from './stores';

export class DataService {
	public orders: OrderService;
	public products: ProductService;
	public stores: StoreService;

	constructor() {
		const api = new APIService();

		this.orders = new OrderService(api);
		this.products = new ProductService(api);
		this.stores = new StoreService(api);
	}
}

const dataService = new DataService();

export default dataService;
