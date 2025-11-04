import Link from 'next/link';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

const MobileTabBar = () => {
	return (
		<div className='fixed bottom-0 left-0 right-0 bg-background border-t sm:hidden'>
			<div className='flex justify-between items-center px-4 py-4'>
				<Link href='/home'>
					<Home className='size-6' />
				</Link>
				<Link href='/search'>
					<Search className='size-6' />
				</Link>
				<Link href='/carts'>
					<ShoppingBag className='size-6' />
				</Link>
				<Link href='/profile'>
					<User className='size-6' />
				</Link>
			</div>
		</div>
	);
};

export default MobileTabBar;
