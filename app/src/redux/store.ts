import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import thunk, { ThunkAction } from 'redux-thunk';

import authReducer from './auth/reducer';
import preferencesReducer from './preferences/reducer';

const rootReducer = combineReducers({
	auth: persistReducer({ key: 'auth', storage: AsyncStorage }, authReducer),
	preferences: persistReducer(
		{ key: 'preferences', storage: AsyncStorage },
		preferencesReducer
	)
});

const middleware = applyMiddleware(thunk);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	null,
	Action<string>
>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const store = createStore(rootReducer, middleware);
export const persistor = persistStore(store);
