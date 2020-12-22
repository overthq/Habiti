// This is a mock file for the types that are required to make this app function correctly.
// They will be removed in favour of actual data from the server in the near future (or not).

export enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Fulfilled = 'Fulfilled'
}

export const stores = [
	{
		id: '1',
		name: 'Nike',
		bio: 'Just do it.',
		avatarUrl:
			'https://pbs.twimg.com/profile_images/953320896101412864/UdE5mfkP_400x400.jpg',
		links: {
			twitter: 'nike',
			instagram: 'nike',
			website: 'https://nike.com'
		}
	},
	{
		id: '2',
		name: 'Adidas',
		bio: 'Through sport we have the power to change lives',
		avatarUrl:
			'https://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr_400x400.jpg',
		links: {
			twitter: 'adidas',
			instagram: 'adidas',
			website: 'https://adidas.com'
		}
	},
	{
		id: '3',
		name: 'Allbirds',
		bio:
			'At Allbirds, we make better things in a better way using premium natural materials',
		avatarUrl:
			'https://pbs.twimg.com/profile_images/697176316597014529/Y1pGIwKT_400x400.jpg',
		links: {
			twitter: 'allbirds',
			instagram: 'allbirds',
			website: 'https://allbirds.com'
		}
	},
	{
		id: '4',
		name: 'Atoms',
		bio: `A shoe you'd want to wear everyday`,
		avatarUrl:
			'https://pbs.twimg.com/profile_images/911331708875636736/dYsXMVFd_400x400.jpg',
		links: {
			twitter: 'wearatoms',
			instagram: 'wearatoms',
			website: 'https://atoms.com'
		}
	}
];

interface Item {
	id: string;
	storeId: string;
	name: string;
	description: string;
	imageUrl: string;
	unit: string;
	quantity: number;
	price: string;
}

export const items: Item[] = [
	{
		id: '1',
		storeId: '1',
		name: 'LeBron 18',
		description: 'Basketball Shoe',
		imageUrl:
			'https://static.nike.com/a/images/f_auto/q_auto:eco/t_PDP_864_v1/1e421f1a-c89b-4777-9e90-4a9a992cca56/lebron-18-basketball-shoe-M6DgN2.jpg',
		unit: '',
		quantity: 50,
		price: '200'
	},
	{
		id: '2',
		storeId: '1',
		name: 'Nike Air Max 2090',
		description: `Women's Shoe`,
		imageUrl:
			'https://static.nike.com/a/images/f_auto/q_auto:eco/t_PDP_864_v1/f091df7d-25ed-4784-ac14-4e1864773f49/air-max-2090-womens-shoe-nk9ZbX.jpg',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '3',
		storeId: '1',
		name: 'Nike Air Force 1 Crater',
		description: `Women's Shoe`,
		imageUrl:
			'https://static.nike.com/a/images/f_auto/q_auto:eco/t_PDP_864_v1/06bf28f7-db0e-4c51-a958-08c8fcc78ea4/air-force-1-crater-womens-shoe-28NwmB.jpg',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '4',
		storeId: '2',
		name: 'PW UltraBoost DNA',
		description: 'Basketball Shoe',
		imageUrl:
			'https://assets.adidas.com/images/w_385,h_385,f_auto,q_auto:sensitive,fl_lossy/586ed5fb99eb41ad956cac8001049e1d_9366/pw-ultraboost-dna.jpg',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '5',
		storeId: '2',
		name: 'Daily 3.0 Shoes',
		description: 'Basketball Shoe',
		imageUrl:
			'https://assets.adidas.com/images/w_276,h_276,f_auto,q_auto:sensitive,fl_lossy/7fd3c605933d4c59a129aba50160ece5_9366/FW7033_00_plp_standard.jpg',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '6',
		storeId: '2',
		name: 'UltraBoost 20 Shoes',
		description: 'Basketball Shoe',
		unit: '',
		imageUrl:
			'https://assets.adidas.com/images/w_276,h_276,f_auto,q_auto:sensitive,fl_lossy/3046aaed5b7a486e8c7cab6b012f84fe_9366/FV8349_00_plp_standard.jpg',
		quantity: 50,
		price: '150'
	},
	{
		id: '7',
		storeId: '3',
		name: `Men's Wool Runner Mizzles`,
		description: 'Basketball Shoe',
		imageUrl:
			'https://cdn.allbirds.com/image/fetch/q_auto,f_auto/w_530,f_auto,q_auto,b_rgb:f5f5f5/https://cdn.allbirds.com/image/upload/f_auto,q_auto/v1/production/colorway/en-US/images/1bRf7x3NByrcpXwAMRReII/1',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '8',
		storeId: '3',
		name: `Men's Wool Runner-Up Mizzles`,
		description: 'Basketball Shoe',
		imageUrl:
			'https://cdn.allbirds.com/image/fetch/q_auto,f_auto/w_530,f_auto,q_auto,b_rgb:f5f5f5/https://cdn.allbirds.com/image/upload/f_auto,q_auto/v1/production/colorway/en-US/images/1vj0oKn4Grnojpwe2UkKh1/1',
		unit: '',
		quantity: 50,
		price: '150'
	},
	{
		id: '9',
		storeId: '3',
		name: `Men's Tree Dashers`,
		description: 'Basketball Shoe',
		imageUrl:
			'https://cdn.allbirds.com/image/fetch/q_auto,f_auto/w_530,f_auto,q_auto,b_rgb:f5f5f5/https://cdn.allbirds.com/image/upload/f_auto,q_auto/v1/production/colorway/en-US/images/OrbgtJiuAc7M1yL4KvQjw/1',
		unit: '',
		quantity: 50,
		price: '150'
	}
];

interface Order {
	id: string;
	storeId: string;
	status: OrderStatus;
	orderItems: {
		id: string;
		itemId: string;
		quantity: number;
	}[];
}

export const orders: Order[] = [
	{
		id: '1',
		status: OrderStatus.Pending,
		storeId: '1',
		orderItems: [
			{
				id: '1',
				itemId: '1',
				quantity: 1
			},
			{
				id: '2',
				itemId: '2',
				quantity: 1
			}
		]
	},
	{
		id: '2',
		status: OrderStatus.Fulfilled,
		storeId: '2',
		orderItems: [
			{
				id: '1',
				itemId: '4',
				quantity: 2
			},
			{
				id: '2',
				itemId: '5',
				quantity: 3
			}
		]
	}
];
