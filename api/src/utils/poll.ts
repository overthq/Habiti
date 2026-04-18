interface PollUntilOptions {
	intervalMs: number;
	maxAttempts: number;
}

/**
 * Repeatedly calls `fn` every `intervalMs` milliseconds until it returns a
 * truthy value or `maxAttempts` is reached. Errors thrown by `fn` are
 * silently swallowed (treated as "not ready yet"). Resolves when polling
 * ends (either fn returned truthy or attempts were exhausted).
 */
export const pollUntil = (
	fn: () => Promise<unknown>,
	options: PollUntilOptions
): Promise<void> => {
	return new Promise(resolve => {
		let attempts = 0;

		const interval = setInterval(async () => {
			attempts++;
			try {
				const result = await fn();
				if (result) {
					clearInterval(interval);
					resolve();
					return;
				}
			} catch {
				// Not ready yet, keep polling
			}

			if (attempts >= options.maxAttempts) {
				clearInterval(interval);
				resolve();
			}
		}, options.intervalMs);
	});
};
