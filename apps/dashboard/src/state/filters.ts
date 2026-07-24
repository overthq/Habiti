import { create } from 'zustand';

import { OrderStatus } from '../data/types';

export interface OrdersFilters {
	status?: OrderStatus;
	minPrice?: number;
	maxPrice?: number;
	categories?: string[];
	sortBy?: 'created-at-desc' | 'total-desc' | 'total-asc';
}

export interface ProductsFilters {
	categoryId?: string;
	sortBy?: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc';
	search?: string;
}

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
