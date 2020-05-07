import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

const icons = {
	chevronRight: <Path d='M9 18l6-6-6-6' />,
	settings: (
		<>
			<Circle cx={12} cy={12} r={3} />
			<Path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z' />
		</>
	),
	shoppingBag: (
		<Path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0' />
	),
	shoppingCart: (
		<>
			<Circle cx={9} cy={21} r={1} />
			<Circle cx={20} cy={21} r={1} />
			<Path d='M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6' />
		</>
	),
	minus: <Path d='M5 12h14' />,
	plus: <Path d='M12 5v14M5 12h14' />
};

interface IconProps {
	size?: number;
	color?: string;
	name: keyof typeof icons;
}

export const Icon: React.FC<IconProps> = ({
	size = 24,
	color = '#000000',
	name
}) => (
	<Svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		fill='none'
		stroke={color}
		strokeWidth={2}
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		{icons[name]}
	</Svg>
);
