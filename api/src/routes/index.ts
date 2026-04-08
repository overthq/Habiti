import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';

import authRoutes from './auth';
import productRoutes from './products';
import currentStoreRoutes from './current-store';
import storeRoutes from './stores';
import currentUserRoutes from './current-user';
import cartRoutes from './carts';
import adminRoutes from './admin';
import uploadRoutes from './uploads';
import paymentRoutes from './payments';
import searchRoutes from './search';
import landingRoutes from './landing';
import webhookRoutes from './webhooks';
import healthRoutes from './health';

const app = new Hono<AppEnv>();

app.route('/auth', authRoutes);
app.route('/products', productRoutes);
app.route('/stores/current', currentStoreRoutes);
app.route('/stores', storeRoutes);
app.route('/users/current', currentUserRoutes);
app.route('/carts', cartRoutes);
app.route('/admin', adminRoutes);
app.route('/uploads', uploadRoutes);
app.route('/payments', paymentRoutes);
app.route('/search', searchRoutes);
app.route('/landing', landingRoutes);
app.route('/webhooks', webhookRoutes);
app.route('/', healthRoutes);

export default app;
