import React from 'react';
import Animated from 'react-native-reanimated';
import Typography from './Typography';

const AnimatedTypography = Animated.createAnimatedComponent(
	React.forwardRef<any, any>((props, ref) => (
		<Typography ref={ref} {...props} />
	))
);

export default AnimatedTypography;
