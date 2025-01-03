import APIService from './api';

interface AddDeliveryAddressBody {
	address: string;
	address2?: string;
	city: string;
	country: string;
	state: string;
	zipCode: string;
}

interface UpdateDeliveryAddressBody {
	address?: string;
	address2?: string;
	city?: string;
	country?: string;
	state?: string;
	zipCode?: string;
}

interface UpdateUserBody {
	name?: string;
	email?: string;
}

export default class UserService {
	private api: APIService;

	constructor(api: APIService) {
		this.api = api;
	}

	public getCurrentUser() {
		return this.api.get('/users/current');
	}

	public updateCurrentUser(body: UpdateUserBody) {
		return this.api.patch('/users/current', body);
	}

	public addDeliveryAddress(body: AddDeliveryAddressBody) {
		return this.api.post('/users/current/delivery-addresses', body);
	}

	public updateDeliveryAddress(
		addressId: string,
		body: UpdateDeliveryAddressBody
	) {
		return this.api.patch(`/delivery-addresses/${addressId}`, body);
	}

	public deleteDeliveryAddress(addressId: string) {
		return this.api.delete(`/delivery-addresses/${addressId}`);
	}

	public getFollowedStores() {
		return this.api.get('/users/current/followed-stores');
	}

	public getManagedStores() {
		return this.api.get('/users/current/managed-stores');
	}

	public getOrders() {
		return this.api.get('/users/current/orders');
	}

	public getCarts() {
		return this.api.get('/users/current/carts');
	}
}
