import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GuestCartStore {
	cartIds: string[];
	addCartId: (id: string) => void;
	removeCartId: (id: string) => void;
	clear: () => void;
}

export const useGuestCartStore = create<GuestCartStore>()(
	persist(
		(set, get) => ({
			cartIds: [],
			addCartId: (id: string) => {
				const existing = get().cartIds;
				if (!existing.includes(id)) {
					set({ cartIds: [...existing, id] });
				}
			},
			removeCartId: (id: string) => {
				set({ cartIds: get().cartIds.filter(cartId => cartId !== id) });
			},
			clear: () => set({ cartIds: [] })
		}),
		{
			name: 'guest-cart-store',
			storage: createJSONStorage(() => window.localStorage)
		}
	)
);
