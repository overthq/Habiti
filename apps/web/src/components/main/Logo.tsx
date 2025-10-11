import React from 'react';

const Logo = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 512 512'
			{...props}
		>
			<path fill='currentColor' d='m448 0 64 64L64 512 0 448z' />
			<path fill='currentColor' d='m191.88 255.881 64-64 256 256-64 64z' />
		</svg>
	);
};

export default Logo;
