import { useQuery } from '@tanstack/react-query';

import dataService from '../services';
import { ProductFilters } from '../services/products';

export const useProductsQuery = (params?: ProductFilters) => {
	return useQuery({
		queryKey: ['products', params],
		queryFn: () => dataService.products.getProducts(params)
	});
};

export const useProductQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id],
		queryFn: () => dataService.products.getProduct(id),
		enabled: !!id
	});
};

export const useProductReviewsQuery = (id: string) => {
	return useQuery({
		queryKey: ['products', id, 'reviews'],
		queryFn: () => dataService.products.getProductReviews(id),
		enabled: !!id
	});
};
