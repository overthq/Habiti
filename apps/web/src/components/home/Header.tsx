import Link from 'next/link';

import CartSheet from '../cart/CartSheet';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';

const Header = () => {
	const { userId, onLogout } = useAuthContext();

	return (
		<nav
			style={{
				padding: 16,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}
		>
			<Link href='/'>
				<p style={{ fontWeight: '500', fontSize: '1.1rem' }}>Habiti</p>
			</Link>
			{!userId ? (
				<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
					<Link href='/login'>Login</Link>
					<Link href='/register'>
						<Button>Register</Button>
					</Link>
				</div>
			) : (
				<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
					<CartSheet />
					<Button onClick={onLogout}>Logout</Button>
				</div>
			)}
		</nav>
	);
};

export default Header;
