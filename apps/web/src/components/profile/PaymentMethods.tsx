import { useCardsQuery } from '@/data/queries';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldTitle
} from '../ui/field';

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
			<h2>Payment Method</h2>

			{data.cards.map(card => (
				<div key={card.id}>
					<p className='capitalize'>
						{card.cardType} {`\u2022\u2022\u2022\u2022${card.last4}`}
					</p>
				</div>
			))}
		</div>
	);
};

export default PaymentMethods;
