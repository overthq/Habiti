import * as userMutations from './users';
import * as productMutations from './products';
import * as orderMutations from './orders';
import * as storeMutations from './stores';
import * as cartMutations from './carts';
import * as imageMutations from './images';
import * as cardMutations from './cards';
import * as payoutMutations from './payouts';
import * as deliveryAddressMutations from './delivery-addresses';

const Mutation = {
	...userMutations,
	...productMutations,
	...orderMutations,
	...storeMutations,
	...cartMutations,
	...imageMutations,
	...cardMutations,
	...payoutMutations,
	...deliveryAddressMutations
};

export default Mutation;
