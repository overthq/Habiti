import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';

import CartSheet from '../cart/CartSheet';

const Header = () => {
	const { userId, onLogout } = useAuthContext();

	return (
		<nav className='border-b'>
			<div className='container mx-auto py-4 px-4 md:px-16 flex justify-between items-center'>
				<Link href='/'>
					<Image
						src='/images/habiti-wordmark-black.svg'
						alt='Habiti'
						height={30}
						width={85}
					/>
				</Link>
				{!userId ? (
					<div className='flex gap-4 items-center'>
						<Link href='/login'>Login</Link>
						<Link href='/register'>
							<Button>Register</Button>
						</Link>
					</div>
				) : (
					<div className='flex gap-4 items-center'>
						<CartSheet />
						<Button onClick={onLogout}>Logout</Button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Header;
