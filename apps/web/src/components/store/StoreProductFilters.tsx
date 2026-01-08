'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { StoreProductsSortOption } from '@/hooks/use-store-filters';

interface StoreProductFiltersProps {
	sortBy: StoreProductsSortOption;
	onSortChange: (value: StoreProductsSortOption) => void;
}

const StoreProductFilters: React.FC<StoreProductFiltersProps> = ({
	sortBy,
	onSortChange
}) => {
	return (
		<div className='flex gap-2'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='sm'>
						Sort by <ChevronDown />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'default'}
						onCheckedChange={() => onSortChange('default')}
					>
						Default
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'newest-to-oldest'}
						onCheckedChange={() => onSortChange('newest-to-oldest')}
					>
						Newest to oldest
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'highest-to-lowest-price'}
						onCheckedChange={() => onSortChange('highest-to-lowest-price')}
					>
						Highest to lowest price
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'lowest-to-highest-price'}
						onCheckedChange={() => onSortChange('lowest-to-highest-price')}
					>
						Lowest to highest price
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button variant='outline' size='sm'>
				In stock
			</Button>
		</div>
	);
};

export default StoreProductFilters;
