import React from 'react';
import debounce from 'lodash.debounce';

const useDebounce = <F extends (...args: any[]) => any>(
	callback: F,
	delay: number = 1000
) => {
	const ref = React.useRef<F | null>(null);

	React.useEffect(() => {
		ref.current = callback;
	}, [callback]);

	const debouncedCallback = React.useMemo(() => {
		const func = (...args: Parameters<F>) => {
			ref.current?.(...args);
		};

		return debounce(func, delay);
	}, [delay]);

	// Run a pending call instead of dropping it when the component goes away,
	// e.g. a cart quantity change followed straight away by "Checkout".
	React.useEffect(() => () => debouncedCallback.flush(), [debouncedCallback]);

	return debouncedCallback;
};

export default useDebounce;
