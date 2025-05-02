import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='bg-gray-100 py-8'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-wrap justify-between'>
					<div className='w-full md:w-1/3 mb-6 md:mb-0'>
						<h3 className='text-lg font-semibold mb-2'>Habiti</h3>
						<p className='text-sm text-gray-600'>
							Simplifying online shopping for everyone.
						</p>
					</div>
					<div className='w-full md:w-1/3 mb-6 md:mb-0'>
						<h3 className='text-lg font-semibold mb-2'>Quick Links</h3>
						<ul className='text-sm'>
							<li className='mb-2'>
								<Link href='/'>Home</Link>
							</li>
							<li className='mb-2'>
								<Link href='/about'>About</Link>
							</li>
							<li className='mb-2'>
								<Link href='/privacy-policy'>Privacy Policy</Link>
							</li>
							<li className='mb-2'>
								<Link href='/acceptable-use'>Acceptable Use Policy</Link>
							</li>
							<li className='mb-2'>
								<Link href='/support'>Support</Link>
							</li>
						</ul>
					</div>
					<div className='w-full md:w-1/3'>
						<h3 className='text-lg font-semibold mb-2'>Contact Us</h3>
						<p className='text-sm text-gray-600'>Email: support@habiti.app</p>
					</div>
				</div>
				<div className='mt-8 text-center text-sm text-gray-600'>
					© {new Date().getFullYear()} Habiti. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
