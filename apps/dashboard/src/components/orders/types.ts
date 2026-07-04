import { OrderStatus } from '../../data/types';

export interface OrdersFilters {
	status?: OrderStatus;
	minPrice?: number;
	maxPrice?: number;
	categories?: string[];
	sortBy?: 'created-at-desc' | 'total-desc' | 'total-asc';
}
