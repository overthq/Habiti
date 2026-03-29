import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import * as SecureStore from 'expo-secure-store';

import useStore from '../state';
import { AppStackParamList } from '../navigation/types';
import {
	updateCurrentStore,
	deleteProduct,
	createProduct,
	deleteStore,
	updateProduct,
	createPayout,
	createStore,
	createProductCategory,
	updateOrder,
	deleteProductCategory,
	updateProductCategory,
	updateProductCategories,
	verifyBankAccount,
	createAddress,
	updateAddress,
	deleteAddress,
	deleteAccount
} from './requests';
import env from '../../env';
import {
	CreatePayoutBody,
	CreateProductBody,
	CreateProductCategoryBody,
	CreateStoreBody,
	CreateAddressBody,
	UpdateCurrentStoreBody,
	UpdateOrderArgs,
	UpdateProductArgs,
	UpdateProductCategoriesArgs,
	UpdateProductCategoryArgs,
	UpdateAddressArgs,
	VerifyBankAccountBody
} from './types';
import { Alert } from 'react-native';

interface RegisterArgs {
	email: string;
	name: string;
}

export const useRegisterMutation = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return useMutation({
		mutationFn: async (input: RegisterArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/register`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Unable to create account');
			}

			return response.json();
		},
		onSuccess: (_, variables) => {
			navigate('Verify', { email: variables.email });
		},
		onError: () => {
			Alert.alert(
				'Unable to register',
				'An error occurred while trying to create your account'
			);
		}
	});
};

interface AuthenticateArgs {
	email: string;
}

export const useAuthenticateMutation = () => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return useMutation({
		mutationFn: async (input: AuthenticateArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/login`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		},
		onSuccess: (_, variables) => {
			navigate('Verify', { email: variables.email });
		}
	});
};

interface VerifyCodeArgs {
	email: string;
	code: string;
}

export const useVerifyCodeMutation = () => {
	const logIn = useStore(useShallow(state => state.logIn));

	return useMutation({
		mutationFn: async (input: VerifyCodeArgs) => {
			const response = await fetch(`${env.apiUrl}/auth/verify-code`, {
				method: 'POST',
				body: JSON.stringify(input),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return response.json();
		},
		onSuccess: async data => {
			logIn(data.accessToken);
			await SecureStore.setItemAsync('refreshToken', data.refreshToken);
		}
	});
};

export const useUpdateCurrentStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateCurrentStoreBody) => updateCurrentStore(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['stores', 'current'] });
		}
	});
};

export const useUpdateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: UpdateProductArgs) => {
			return updateProduct(args.productId, args.body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'products']
			});
		}
	});
};

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateProductBody) => createProduct(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'products']
			});
		}
	});
};

export const useUpdateOrderMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: UpdateOrderArgs) => {
			return updateOrder(args.orderId, args.body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['orders']
			});
		},
		onError: error => {
			console.log(error);
		}
	});
};

export const useDeleteProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: string) => deleteProduct(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'products']
			});
		}
	});
};

export const useCreateProductCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateProductCategoryBody) => {
			return createProductCategory(body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'categories']
			});
		}
	});
};

export const useCreateStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateStoreBody) => createStore(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores']
			});
		}
	});
};

export const useDeleteStoreMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (storeId: string) => deleteStore(storeId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores']
			});
		}
	});
};

export const useUpdateProductCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: UpdateProductCategoryArgs) => {
			return updateProductCategory(args.categoryId, args.body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'categories']
			});
		}
	});
};

export const useDeleteProductCategoryMutation = (categoryId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteProductCategory(categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'categories']
			});
		}
	});
};

export const useUpdateProductCategoriesMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: UpdateProductCategoriesArgs) => {
			return updateProductCategories(args.productId, args.body);
		},
		onSuccess: ({ product }) => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'products', product.id]
			});
		}
	});
};

export const useCreatePayoutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreatePayoutBody) => createPayout(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'transactions']
			});
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current']
			});
		}
	});
};

export const useVerifyBankAccountMutation = () => {
	return useMutation({
		mutationFn: (body: VerifyBankAccountBody) => verifyBankAccount(body)
	});
};

export const useCreateAddressMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CreateAddressBody) => createAddress(body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'addresses']
			});
		}
	});
};

export const useUpdateAddressMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (args: UpdateAddressArgs) => {
			return updateAddress(args.addressId, args.body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'addresses']
			});
		}
	});
};

export const useDeleteAddressMutation = (addressId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => deleteAddress(addressId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['stores', 'current', 'addresses']
			});
		}
	});
};

export const useDeleteAccountMutation = () => {
	const logOut = useStore(useShallow(state => state.logOut));

	return useMutation({
		mutationFn: () => deleteAccount(),
		onSuccess: async () => {
			await SecureStore.deleteItemAsync('refreshToken');
			logOut();
		}
	});
};
