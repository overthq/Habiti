import { Link } from '@tanstack/react-router';

const Footer = () => {
	return (
		<footer className='border-t bg-background'>
			<div className='container py-10'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div>
						<h3 className='text-base font-semibold'>Habiti</h3>
						<p className='mt-2 text-sm text-muted-foreground'>
							Simplifying online shopping for everyone.
						</p>
					</div>
					<div>
						<h3 className='text-base font-semibold'>Links</h3>
						<ul className='mt-2 space-y-2 text-sm text-muted-foreground'>
							<li>
								<Link to='/about' className='hover:text-foreground'>
									About
								</Link>
							</li>
							<li>
								<Link to='/privacy-policy' className='hover:text-foreground'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to='/acceptable-use' className='hover:text-foreground'>
									Acceptable Use
								</Link>
							</li>
							<li>
								<Link to='/support' className='hover:text-foreground'>
									Support
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className='text-base font-semibold'>Contact</h3>
						<p className='mt-2 text-sm text-muted-foreground'>
							support@habiti.app
						</p>
					</div>
				</div>
				<div className='mt-10 text-center text-xs text-muted-foreground'>
					© {new Date().getFullYear()} Habiti. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
