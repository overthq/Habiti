import { StateCreator } from 'zustand';

import { AppState, Mutators, ProductFiltersSlice } from './types';

export const createProductFiltersSlice: StateCreator<
	AppState,
	Mutators,
	[],
	ProductFiltersSlice
> = set => ({
	categories: [],
	inStock: undefined,
	minPrice: undefined,
	maxPrice: undefined,
	clear: () => {
		set({ categories: [], inStock: undefined });
	}
});
