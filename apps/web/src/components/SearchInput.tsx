import React from 'react';
import {
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList
} from './ui/command';
import { CommandDialog } from './ui/command';
import { useGlobalSearchQuery } from '@/data/queries';
import { Product, Store } from '@/data/types';
import Image from 'next/image';

import { SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface ProductCardProps {
	product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	return (
		<Link href={`/product/${product.id}`}>
			<div className='flex items-center gap-2'>
				<div className='size-8 bg-muted rounded-md overflow-hidden'>
					{product.images.length > 0 && (
						<Image
							src={product.images[0].path}
							alt={product.name}
							className='size-full object-cover'
							width={32}
							height={32}
						/>
					)}
				</div>
				<div>
					<h3>{product.name}</h3>
				</div>
			</div>
		</Link>
	);
};

interface StoreCardProps {
	store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
	return (
		<Link href={`/store/${store.id}`}>
			<div className='flex items-center gap-2'>
				<div className='size-8 bg-muted rounded-md overflow-hidden'>
					{store.image && (
						<Image
							src={store.image.path}
							alt={store.name}
							className='size-full object-cover'
							width={32}
							height={32}
						/>
					)}
				</div>
				<div>
					<h3>{store.name}</h3>
				</div>
			</div>
		</Link>
	);
};

const SearchInput = () => {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState('');
	const { data } = useGlobalSearchQuery(query);

	return (
		<>
			<Button
				className='w-full'
				variant='outline'
				onClick={() => setOpen(true)}
			>
				<SearchIcon className='w-4 h-4' />
				<span className='text-sm text-muted-foreground'>
					Search products and stores
				</span>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder='Search products and stores'
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{data?.products.map(product => (
						<CommandItem key={product.id}>
							<ProductCard product={product} />
						</CommandItem>
					))}
					{data?.stores.map(store => (
						<CommandItem key={store.id}>
							<StoreCard store={store} />
						</CommandItem>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default SearchInput;
