import { AsyncStorage } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';
import logger from 'redux-logger';

import authReducer from './auth/reducer';
import cartsReducer from './carts/reducer';

const rootReducer = combineReducers({
	auth: persistReducer({ key: 'auth', storage: AsyncStorage }, authReducer),
	carts: persistReducer({ key: 'carts', storage: AsyncStorage }, cartsReducer)
});

const middleware = applyMiddleware(thunk, logger);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	null,
	Action<string>
>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const store = createStore(rootReducer, middleware);
export const persistor = persistStore(store);
