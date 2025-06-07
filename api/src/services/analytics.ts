import { PostHog } from 'posthog-node';
import posthogClient from '../config/posthog';

export interface AnalyticsEvent {
	event: string;
	distinctId?: string;
	properties?: Record<string, any>;
	groups?: Record<string, string | number>;
	timestamp?: Date;
}

export interface AnalyticsIdentifyData {
	distinctId: string;
	properties?: Record<string, any>;
}

export interface AnalyticsGroupData {
	groupType: string;
	groupKey: string;
	properties?: Record<string, any>;
}

export interface AnalyticsAlias {
	distinctId: string;
	alias: string;
}

export default class AnalyticsService {
	private client: PostHog;
	private isEnabled: boolean;

	constructor(client?: PostHog) {
		this.client = client || posthogClient;
		this.isEnabled = !!process.env.POSTHOG_API_KEY;
	}

	async track(event: AnalyticsEvent): Promise<void> {
		if (!this.isEnabled) {
			console.warn(
				'PostHog is not configured - skipping analytics event:',
				event.event
			);
			return;
		}

		try {
			this.client.capture({
				distinctId: event.distinctId || 'anonymous',
				event: event.event,
				properties: this.enrichProperties(event.properties),
				groups: event.groups || {},
				timestamp: event.timestamp ?? new Date()
			});
		} catch (error) {
			console.error('Failed to track analytics event:', error);
		}
	}

	async identify(data: AnalyticsIdentifyData): Promise<void> {
		if (!this.isEnabled) return;

		try {
			this.client.identify({
				distinctId: data.distinctId,
				properties: data.properties || {}
			});
		} catch (error) {
			console.error('Failed to identify user:', error);
		}
	}

	async group(data: AnalyticsGroupData): Promise<void> {
		if (!this.isEnabled) return;

		try {
			this.client.groupIdentify({
				groupType: data.groupType,
				groupKey: data.groupKey,
				properties: data.properties || {}
			});
		} catch (error) {
			console.error('Failed to update group:', error);
		}
	}

	async alias(data: AnalyticsAlias): Promise<void> {
		if (!this.isEnabled) return;

		try {
			this.client.alias({
				distinctId: data.distinctId,
				alias: data.alias
			});
		} catch (error) {
			console.error('Failed to create alias:', error);
		}
	}

	async trackOrderEvent(
		eventName: string,
		orderData: {
			orderId: string;
			userId: string;
			storeId: string;
			amount: number;
			status?: string;
			paymentMethod?: string;
			productCount?: number;
			products?: Array<{
				id: string;
				name: string;
				category?: string;
				price: number;
				quantity: number;
			}>;
		}
	): Promise<void> {
		await this.track({
			event: eventName,
			distinctId: orderData.userId,
			properties: {
				orderId: orderData.orderId,
				amount: orderData.amount,
				status: orderData.status,
				paymentMethod: orderData.paymentMethod,
				productCount: orderData.productCount,
				products: orderData.products,
				// Revenue tracking
				revenue: orderData.amount,
				currency: 'NGN'
			},
			groups: {
				store: orderData.storeId
			}
		});
	}

	async trackProductEvent(
		eventName: string,
		productData: {
			productId: string;
			userId?: string;
			storeId: string;
			productName: string;
			category?: string;
			price?: number;
			quantity?: number;
			searchQuery?: string;
		}
	): Promise<void> {
		await this.track({
			event: eventName,
			distinctId: productData.userId || 'anonymous',
			properties: {
				productId: productData.productId,
				productName: productData.productName,
				category: productData.category,
				price: productData.price,
				quantity: productData.quantity,
				searchQuery: productData.searchQuery
			},
			groups: {
				store: productData.storeId
			}
		});
	}

	/**
	 * Track store-related events
	 */
	async trackStoreEvent(
		eventName: string,
		storeData: {
			storeId: string;
			userId?: string;
			storeName?: string;
			category?: string;
			action?: string;
		}
	): Promise<void> {
		await this.track({
			event: eventName,
			distinctId: storeData.userId || 'anonymous',
			properties: {
				storeName: storeData.storeName,
				category: storeData.category,
				action: storeData.action
			},
			groups: {
				store: storeData.storeId
			}
		});
	}

	/**
	 * Track user authentication events
	 */
	async trackAuthEvent(
		eventName: string,
		userData: {
			userId: string;
			method?: string;
			success?: boolean;
			errorCode?: string;
		}
	): Promise<void> {
		await this.track({
			event: eventName,
			distinctId: userData.userId,
			properties: {
				method: userData.method,
				success: userData.success,
				errorCode: userData.errorCode
			}
		});
	}

	/**
	 * Track payment-related events
	 */
	async trackPaymentEvent(
		eventName: string,
		paymentData: {
			userId: string;
			orderId?: string;
			amount: number;
			currency?: string;
			paymentMethod: string;
			success?: boolean;
			errorCode?: string;
			provider?: string;
		}
	): Promise<void> {
		await this.track({
			event: eventName,
			distinctId: paymentData.userId,
			properties: {
				orderId: paymentData.orderId,
				amount: paymentData.amount,
				currency: paymentData.currency || 'NGN',
				paymentMethod: paymentData.paymentMethod,
				success: paymentData.success,
				errorCode: paymentData.errorCode,
				provider: paymentData.provider || 'paystack',
				// Revenue tracking for successful payments
				...(paymentData.success && { revenue: paymentData.amount })
			}
		});
	}

	/**
	 * Flush any pending events (useful for serverless functions)
	 */
	async flush(): Promise<void> {
		if (!this.isEnabled) return;

		try {
			await this.client.flush();
		} catch (error) {
			console.error('Failed to flush analytics events:', error);
		}
	}

	/**
	 * Shutdown the client gracefully
	 */
	async shutdown(): Promise<void> {
		if (!this.isEnabled) return;

		try {
			await this.client.shutdown();
		} catch (error) {
			console.error('Failed to shutdown analytics client:', error);
		}
	}

	/**
	 * Enrich event properties with common metadata
	 */
	private enrichProperties(
		properties: Record<string, any> = {}
	): Record<string, any> {
		return {
			...properties,
			// Add common properties
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || 'development',
			version: process.env.APP_VERSION || '1.0.0',
			platform: 'api'
		};
	}

	/**
	 * Helper method to generate consistent event names
	 */
	static eventName(category: string, action: string, object?: string): string {
		const parts = [category, action];
		if (object) parts.push(object);
		return parts.join('_').toLowerCase();
	}
}

// Export common event names as constants
export const ANALYTICS_EVENTS = {
	// Order events
	ORDER_CREATED: 'order_created',
	ORDER_UPDATED: 'order_updated',
	ORDER_COMPLETED: 'order_completed',
	ORDER_CANCELLED: 'order_cancelled',
	ORDER_PAID: 'order_paid',

	// Product events
	PRODUCT_VIEWED: 'product_viewed',
	PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
	PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
	PRODUCT_SEARCHED: 'product_searched',
	PRODUCT_CREATED: 'product_created',
	PRODUCT_UPDATED: 'product_updated',

	// Store events
	STORE_VIEWED: 'store_viewed',
	STORE_FOLLOWED: 'store_followed',
	STORE_UNFOLLOWED: 'store_unfollowed',
	STORE_CREATED: 'store_created',

	// User events
	USER_REGISTERED: 'user_registered',
	USER_LOGGED_IN: 'user_logged_in',
	USER_LOGGED_OUT: 'user_logged_out',
	USER_PROFILE_UPDATED: 'user_profile_updated',

	// Payment events
	PAYMENT_INITIATED: 'payment_initiated',
	PAYMENT_SUCCESS: 'payment_success',
	PAYMENT_FAILED: 'payment_failed',
	CARD_ADDED: 'card_added',

	// Cart events
	CART_VIEWED: 'cart_viewed',
	CART_UPDATED: 'cart_updated',
	CHECKOUT_STARTED: 'checkout_started',
	CHECKOUT_COMPLETED: 'checkout_completed'
} as const;
