import { useCardsQuery } from '@/data/queries';
import { Skeleton } from '../ui/skeleton';

const PaymentMethodsSkeleton = () => {
	return (
		<div>
			<Skeleton />
		</div>
	);
};

const PaymentMethods = () => {
	const { isLoading, data } = useCardsQuery();

	if (isLoading || !data) {
		return <PaymentMethodsSkeleton />;
	}

	return (
		<div>
			<h2 className='text-xl font-medium mb-4'>Payment Methods</h2>

			<div>
				{data.cards.map(card => (
					<div key={card.id} className='flex'>
						<p className='capitalize'>{card.cardType}</p>
						<p>{`\u2022\u2022\u2022\u2022${card.last4}`}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default PaymentMethods;
