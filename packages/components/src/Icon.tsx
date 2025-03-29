import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Svg, Circle, Rect, Path, SvgProps } from 'react-native-svg';

import { useTheme } from './Theme';

const icons = {
	'arrow-up-right': <Path d='M7 7h10v10M7 17 17 7' />,
	bell: (
		<Path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' />
	),
	bookmark: <Path d='m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />,
	check: <Path d='M20 6L9 17l-5-5' />,
	'chevron-left': <Path d='M15 18l-6-6 6-6' />,
	'chevron-right': <Path d='M9 18l6-6-6-6' />,
	'chevron-down': <Path d='m6 9 6 6 6-6' />,
	'chevrons-up-down': <Path d='m7 15 5 5 5-5M7 9l5-5 5 5' />,
	filter: <Path d='M22 3H2l8 9.46V19l4 2v-8.54L22 3z' />,
	inbox: (
		<>
			<Path d='M22 12h-6l-2 3h-4l-2-3H2' />
			<Path d='M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z' />
		</>
	),
	instagram: (
		<>
			<Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
			<Path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01' />
		</>
	),
	settings: (
		<>
			<Circle cx={12} cy={12} r={3} />
			<Path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z' />
		</>
	),
	'shopping-bag': (
		<Path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0' />
	),
	'shopping-cart': (
		<>
			<Circle cx={9} cy={21} r={1} />
			<Circle cx={20} cy={21} r={1} />
			<Path d='M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6' />
		</>
	),
	tag: (
		<Path d='M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01' />
	),
	trash: (
		<Path d='M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' />
	),
	twitter: (
		<Path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />
	),
	'log-out': (
		<Path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />
	),
	minus: <Path d='M5 12h14' />,
	'more-vertical': (
		<>
			<Circle cx={12} cy={12} r={1} />
			<Circle cx={12} cy={5} r={1} />
			<Circle cx={12} cy={19} r={1} />
		</>
	),
	'more-horizontal': (
		<>
			<Circle cx={12} cy={12} r={1} />
			<Circle cx={19} cy={12} r={1} />
			<Circle cx={5} cy={12} r={1} />
		</>
	),
	plus: <Path d='M12 5v14M5 12h14' />,
	home: (
		<Path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
	),
	search: <Path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />,
	'sliders-horizontal': (
		<Path d='M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4' />
	),
	user: (
		<Path d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
	),
	upload: (
		<Path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' />
	),
	x: <Path d='M18 6 6 18M6 6l12 12' />
};

export interface IconProps extends SvgProps {
	size?: number;
	color?: string;
	name: keyof typeof icons;
	style?: StyleProp<ViewStyle>;
}

export type IconType = keyof typeof icons;

export const Icon: React.FC<IconProps> = ({
	size = 24,
	color,
	name,
	style,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color ?? theme.icon.default.color}
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			style={style}
			{...props}
		>
			{icons[name]}
		</Svg>
	);
};
