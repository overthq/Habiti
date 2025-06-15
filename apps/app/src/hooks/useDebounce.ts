import React from 'react';
import debounce from 'lodash.debounce';

const useDebounce = (
	callback: (...args: any[]) => void,
	delay: number = 1000
) => {
	const ref = React.useRef(null);

	React.useEffect(() => {
		ref.current = callback;
	}, [callback]);

	const debouncedCallback = React.useMemo(() => {
		const func = (...args: any[]) => {
			ref.current?.(...args);
		};

		return debounce(func, delay);
	}, []);

	return debouncedCallback;
};

export default useDebounce;
