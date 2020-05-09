import React from 'react';

const icons = {
	home: (
		<path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
	),
	search: <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />,
	tag: (
		<path d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
	),
	trendingUp: <path d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />,
	user: (
		<path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
	),
	users: (
		<path d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
	),
	chartBar: (
		<path d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
	),
	check: <path d='M5 13l4 4L19 7' />,
	x: <path d='M6 18L18 6M6 6l12 12' />,
	chevronLeft: <path d='M15 19l-7-7 7-7' />,
	chevronRight: <path d='M9 5l7 7-7 7' />
};

interface IconProps {
	name: keyof typeof icons;
	color?: string;
	size?: number;
}

export const Icon: React.FC<IconProps> = ({
	name,
	color = '#000000',
	size = 24
}) => (
	<svg
		width={size}
		height={size}
		fill='none'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		stroke={color}
		viewBox='0 0 24 24'
	>
		{icons[name]}
	</svg>
);
