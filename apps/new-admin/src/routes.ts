import { type RouteConfig, layout, route } from '@react-router/dev/routes';

export default [
	layout('./pages/auth/layout.tsx', [
		route('login', './pages/auth/login.tsx'),
		route('register', './pages/auth/register.tsx')
	]),

	layout('./pages/dashboard/layout.tsx', [
		route('stores', './pages/dashboard/stores.tsx'),
		route('stores/:id', './pages/dashboard/store.tsx'),
		route('orders', './pages/dashboard/orders.tsx'),
		route('orders/:id', './pages/dashboard/order.tsx'),
		route('products', './pages/dashboard/products.tsx'),
		route('products/:id', './pages/dashboard/product.tsx'),
		route('users', './pages/dashboard/users.tsx'),
		route('users/:id', './pages/dashboard/user.tsx')
	]),

	// * matches all URLs, the ? makes it optional so it will match / as well
	route('*?', 'catchall.tsx')
] satisfies RouteConfig;
