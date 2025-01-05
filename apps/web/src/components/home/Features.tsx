const Features = () => {
	return (
		<div className='py-16 bg-white'>
			<div className='max-w-7xl mx-auto px-4'>
				<h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
					Everything you need to shop smarter
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='p-6 rounded-xl bg-gray-50'>
						<div className='w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-white'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							Universal Order Tracking
						</h3>
						<p className='text-gray-600'>
							Track all your online orders in one place, regardless of the
							retailer. Get real-time updates and notifications.
						</p>
					</div>
					<div className='p-6 rounded-xl bg-gray-50'>
						<div className='w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-white'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							Smart Price Alerts
						</h3>
						<p className='text-gray-600'>
							Set price alerts for your favorite items and get notified when
							they go on sale or drop in price.
						</p>
					</div>
					<div className='p-6 rounded-xl bg-gray-50'>
						<div className='w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-white'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							Shopping History
						</h3>
						<p className='text-gray-600'>
							Access your complete shopping history across all stores. Track
							spending and manage returns easily.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Features;
