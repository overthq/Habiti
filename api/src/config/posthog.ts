import { PostHog } from 'posthog-node';
import { env } from './env';

const client = new PostHog(env.POSTHOG_API_KEY, {
	host: 'https://us.i.posthog.com'
});

export default client;
