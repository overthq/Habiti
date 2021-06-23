import { GraphQLClient } from 'graphql-request';
import {
	CREATE_IMAGES,
	CREATE_ITEMS,
	CREATE_STORES,
	CREATE_USERS
} from './utils/queries';

const client = new GraphQLClient('http://locahost:8080/v1/graphql', {
	headers: {
		'x-hasura-admin-secret': 'market-admin-secret'
	}
});

const imageUrls = [
	'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
	'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
	'https://images.unsplash.com/photo-1606834330324-544ea3bf3015?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'
];

const createStores = async (): Promise<string[]> => {
	const data = await client.request(CREATE_STORES, {
		input: [
			{ name: 'Store 1', short_name: 'store_one' },
			{ name: 'Store 2', short_name: 'store_two' },
			{ name: 'Store 3', short_name: 'store_three' }
		]
	});
	console.log(data);
	return data.returning.map(({ id }) => id);
};

const createItems = async (storeIds: string[]) => {
	await client.request(CREATE_ITEMS, { input: storeIds });
};

const createImages = async () => {
	client.request(CREATE_IMAGES, {
		input: imageUrls.map(i => ({ path_url: i }))
	});
};

const createUsers = async () => {
	await client.request(CREATE_USERS, {
		input: [
			{ name: 'Person 1', phone: '08012345678' },
			{ name: 'Person 2', phone: '08023456789' }
		]
	});
};

const main = async () => {
	await createImages();
	await createUsers();
	const storeIds = await createStores();
	await createItems(storeIds);
};

main().catch(e => console.error(e));
