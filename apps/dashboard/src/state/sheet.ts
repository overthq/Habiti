import { create } from 'zustand';

import type { SheetName, SheetParams } from '../navigation/Sheets';

interface SheetState {
	activeName: SheetName | null;
	rendered: SheetName | null;
	params: SheetParams[SheetName] | undefined;
	requestId: number;
	present: <Name extends SheetName>(
		name: Name,
		params: SheetParams[Name]
	) => number;
	close: () => void;
	finishDismiss: () => void;
}

export const useSheetStore = create<SheetState>(set => ({
	activeName: null,
	rendered: null,
	params: undefined,
	requestId: 0,
	present: (name, params) => {
		let id = 0;
		set(state => {
			id = state.requestId + 1;
			return { activeName: name, rendered: name, params, requestId: id };
		});
		return id;
	},
	close: () => set({ activeName: null }),
	finishDismiss: () => set({ rendered: null, params: undefined })
}));

type Resolver = (value: unknown) => void;

const resolvers = new Map<number, Resolver>();

export const registerResolver = (id: number, resolve: Resolver) => {
	resolvers.set(id, resolve);
};

export const resolveRequest = (id: number, value: unknown) => {
	const resolve = resolvers.get(id);

	if (resolve) {
		resolvers.delete(id);
		resolve(value);
	}
};
