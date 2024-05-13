import React from 'react';

// H/T: https://stackoverflow.com/questions/65027884
const useFirstRender = () => {
	const ref = React.useRef(true);
	const firstRender = ref.current;
	ref.current = false;

	return firstRender;
};

export default useFirstRender;
