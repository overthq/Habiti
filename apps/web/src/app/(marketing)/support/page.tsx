'use client';

import React from 'react';

const SupportPage = () => {
	return (
		<div className='container flex flex-col flex-1 py-8 gap-3'>
			<h1 className='scroll-m-20 text-4xl font-semibold tracking-tight mb-4'>
				Support
			</h1>
			<p>
				If you need assistance with Habiti, please don&apos;t hesitate to
				contact us. We&apos;re here to help!
			</p>
			<h2 className='text-2xl font-medium'>Contact Information</h2>{' '}
			<ul className='list-disc list-inside'>
				<li>Email: support@habiti.app</li>
				<li>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</li>
			</ul>
			<h2 className='text-2xl font-medium'>Frequently Asked Questions</h2>
			<div className='space-y-4'>
				<div>
					<h3 className='text-xl font-medium mb-2'>
						How do I reset my password?
					</h3>
					<p>
						To reset your password, go to the login page and click on the
						&quot;Forgot Password link.&quot; Follow the instructions sent to
						your email to create a new password.
					</p>
				</div>
				<div>
					<h3 className='text-xl font-medium mb-2'>
						How can I update my payment information?
					</h3>
					<p>
						You can update your payment information in the app by going to
						Settings &gt; Payment Methods. From there, you can add, edit, or
						remove payment methods.
					</p>
				</div>
				<div>
					<h3 className='text-xl font-medium mb-2'>
						What should I do if I encounter a bug?
					</h3>
					<p>
						If you encounter a bug, please report it to our support team via
						email at support@habiti.app. Include as much detail as possible,
						including steps to reproduce the issue and any error messages you
						received.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SupportPage;
