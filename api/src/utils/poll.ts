interface PollUntilOptions {
	intervalMs: number;
	maxAttempts: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls `fn` until it returns a truthy value or `maxAttempts` is reached,
 * waiting `intervalMs` between the end of one attempt and the start of the
 * next. Attempts never overlap, so a slow `fn` delays polling rather than
 * running concurrently with itself. Errors thrown by `fn` are silently
 * swallowed (treated as "not ready yet"). Resolves when polling ends (either
 * fn returned truthy or attempts were exhausted).
 */
export const pollUntil = async (
	fn: () => Promise<unknown>,
	options: PollUntilOptions
): Promise<void> => {
	for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
		await sleep(options.intervalMs);

		try {
			if (await fn()) return;
		} catch {
			// Not ready yet, keep polling
		}
	}
};
