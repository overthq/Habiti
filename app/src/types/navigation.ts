export type AppStackParamList = {
	Main: undefined;
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
	Search: undefined;
	Item: { itemId: string };
	Cart: { storeId: string };
};

export type AuthStackParamList = {
	Register: undefined;
	Authenticate: undefined;
	Verify: { phone: string };
};

export type MainStackParamList = {
	Home: undefined;
	Store: { storeId: string };
};
