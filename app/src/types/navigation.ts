export type AppStackParamList = {
	Main: undefined;
	Auth: undefined;
	Search: undefined;
	Item: { itemId: string };
	Cart: { storeId: string };
};

export type AuthStackParamList = {
	Register: undefined;
	Authenticate: undefined;
	VerifyAuthentication: { phone: string };
};

export type MainStackParamList = {
	Home: undefined;
	Store: { storeId: string };
};
