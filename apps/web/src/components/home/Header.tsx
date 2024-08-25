import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Header = () => {
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
			<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
				<Link href='/login'>Login</Link>
				<Link href='/register'>
					<Button>Register</Button>
				</Link>
			</div>
		</nav>
	);
};

export default Header;
