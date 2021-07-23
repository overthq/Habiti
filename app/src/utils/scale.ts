import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const widthBaseScale = width / 414;
const heightBaseScale = height / 896;

export const normalize = (size: number, based = 'width') => {
	const newSize =
		based === 'height' ? size * heightBaseScale : size * widthBaseScale;
	return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
