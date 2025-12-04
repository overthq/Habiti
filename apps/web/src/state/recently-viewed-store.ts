import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RecentlyViewedProduct {
	id: string;
	name: string;
	image?: string | null;
	storeId: string;
	storeName: string;
	unitPrice: number;
	viewedAt: number;
}

interface RecentlyViewedStoreSlice {
	products: RecentlyViewedProduct[];
	addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
	clear: () => void;
}

const MAX_RECENTLY_VIEWED = 6;

export const useRecentlyViewedStore = create<RecentlyViewedStoreSlice>()(
	persist(
		(set, get) => ({
			products: [],
			addProduct: product => {
				const withoutCurrent = get().products.filter(
					item => item.id !== product.id
				);

				const nextProducts = [
					{ ...product, viewedAt: Date.now() },
					...withoutCurrent
				].slice(0, MAX_RECENTLY_VIEWED);

				set({ products: nextProducts });
			},
			clear: () => set({ products: [] })
		}),
		{
			name: 'recently-viewed-products',
			storage: createJSONStorage(() => window.localStorage)
		}
	)
);
