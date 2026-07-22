import { create } from 'zustand';

import { OrdersFilters } from '../components/orders/types';
import { ProductsFilters } from '../components/products/types';

interface OrdersFilterState {
	filters: OrdersFilters;
	setFilters: (partial: Partial<OrdersFilters>) => void;
	clearFilters: () => void;
}

export const useOrdersFilterStore = create<OrdersFilterState>(set => ({
	filters: {},
	setFilters: partial =>
		set(state => ({ filters: { ...state.filters, ...partial } })),
	clearFilters: () => set({ filters: {} })
}));

interface ProductsFilterState {
	filters: ProductsFilters;
	setFilters: (partial: Partial<ProductsFilters>) => void;
	clearFilters: () => void;
}

export const useProductsFilterStore = create<ProductsFilterState>(set => ({
	filters: {},
	setFilters: partial =>
		set(state => ({ filters: { ...state.filters, ...partial } })),
	clearFilters: () => set({ filters: {} })
}));
