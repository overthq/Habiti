import { useCardsQuery } from '@/data/queries';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

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
					<div key={card.id} className='flex py-2'>
						<p className='capitalize'>{card.cardType}</p>
						<p>{`\u2022\u2022\u2022\u2022${card.last4}`}</p>
					</div>
				))}
			</div>

			<Button>
				<Plus />
				Add Card
			</Button>
		</div>
	);
};

export default PaymentMethods;
