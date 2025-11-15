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
			<FieldGroup>
				<FieldSet>
					<FieldLabel>Payment Method</FieldLabel>
					<FieldDescription>
						Choose how you want to pay for this order.
					</FieldDescription>
					<RadioGroup>
						{data.cards.map(card => (
							<FieldLabel htmlFor={card.id}>
								<Field orientation='horizontal'>
									<RadioGroupItem
										value={card.id}
										id={card.id}
										aria-label={card.cardType}
									/>
									<FieldContent>
										<FieldTitle className='capitalize'>
											{card.cardType}
										</FieldTitle>
										<FieldDescription>Ends with {card.last4}</FieldDescription>
									</FieldContent>
								</Field>
							</FieldLabel>
						))}
					</RadioGroup>
				</FieldSet>
			</FieldGroup>
		</div>
	);
};

export default PaymentMethods;
