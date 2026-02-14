interface PollOptions {
	intervalMs?: number;
	maxAttempts?: number;
}

/**
 * Polls `fn` at a fixed interval until `condition` returns true or
 * `maxAttempts` is reached. Resolves with the last result from `fn`.
 */
export const pollUntil = <T>(
	fn: () => Promise<T>,
	condition: (result: T) => boolean,
	{ intervalMs = 5_000, maxAttempts = 24 }: PollOptions = {}
): Promise<T> => {
	return new Promise<T>(resolve => {
		let attempts = 0;

		const interval = setInterval(async () => {
			attempts++;
			try {
				const result = await fn();
				if (condition(result)) {
					clearInterval(interval);
					resolve(result);
					return;
				}
			} catch {
				// Not ready yet, keep polling
			}

			if (attempts >= maxAttempts) {
				clearInterval(interval);
				resolve(await fn());
			}
		}, intervalMs);
	});
};
