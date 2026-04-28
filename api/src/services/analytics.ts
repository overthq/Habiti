import { PostHog } from 'posthog-node';

import { env } from '../config/env';
import { rootLogger } from './logger';

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
	private client: PostHog | null = null;

	constructor() {
		if (!!env.POSTHOG_API_KEY) {
			this.client = new PostHog(env.POSTHOG_API_KEY);
		}
	}

	track(event: AnalyticsEvent) {
		if (!this.client) {
			rootLogger.debug(
				{ event: event.event },
				'analytics.posthog_not_configured'
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
			rootLogger.error(
				{ err: error, event: event.event },
				'analytics.track_failed'
			);
		}
	}

	identify(data: AnalyticsIdentifyData) {
		try {
			this.client?.identify({
				distinctId: data.distinctId,
				properties: data.properties || {}
			});
		} catch (error) {
			rootLogger.error({ err: error }, 'analytics.identify_failed');
		}
	}

	group(data: AnalyticsGroupData) {
		try {
			this.client?.groupIdentify({
				groupType: data.groupType,
				groupKey: data.groupKey,
				properties: data.properties || {}
			});
		} catch (error) {
			rootLogger.error({ err: error }, 'analytics.group_failed');
		}
	}

	alias(data: AnalyticsAlias) {
		try {
			this.client?.alias({
				distinctId: data.distinctId,
				alias: data.alias
			});
		} catch (error) {
			rootLogger.error({ err: error }, 'analytics.alias_failed');
		}
	}

	async flush() {
		try {
			await this.client?.flush();
		} catch (error) {
			rootLogger.error({ err: error }, 'analytics.flush_failed');
		}
	}

	async shutdown(): Promise<void> {
		try {
			await this.client?.shutdown();
		} catch (error) {
			rootLogger.error({ err: error }, 'analytics.shutdown_failed');
		}
	}

	private enrichProperties(
		properties: Record<string, any> = {}
	): Record<string, any> {
		return {
			...properties,
			timestamp: new Date().toISOString(),
			environment: env.NODE_ENV || 'development',
			version: env.APP_VERSION,
			platform: 'api'
		};
	}
}
