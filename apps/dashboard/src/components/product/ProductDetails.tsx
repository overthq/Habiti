import { View } from 'react-native';

import { Spacer, Typography } from '@habiti/components';
import { ProductQuery } from '../../types/api';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
	return (
		<View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
			{/* <Typography size='large' weight='medium' variant='label'>
				Product Details
			</Typography> */}
			<Spacer y={8} />
			<View>
				{/* <Typography size='xlarge' weight='medium' variant='label'>
					Name
				</Typography> */}
				<Typography size='xxlarge' weight='medium' variant='label'>
					{product.name}
				</Typography>
			</View>
			<Spacer y={4} />
			<View>
				{/* <Typography size='large' weight='medium' variant='label'>
					Description
				</Typography> */}
				<Typography variant='secondary'>{product.description}</Typography>
			</View>
		</View>
	);
};

export default ProductDetails;
