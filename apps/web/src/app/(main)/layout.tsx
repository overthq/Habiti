'use client';

import React from 'react';
import { refreshToken } from '@/data/requests';
import MainNavigation from '@/components/main/MainNavigation';
import MobileTabBar from '@/components/main/MobileTabBar';
import { useAuthStore } from '@/state/auth-store';
import { useGuestCartStore } from '@/state/guest-cart-store';
import { useClaimCartsMutation } from '@/data/mutations';
import AuthDrawer from '@/components/AuthDrawer';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { accessToken } = useAuthStore();
	const { cartIds: guestCartIds, clear: clearGuestCarts } = useGuestCartStore();
	const claimCartsMutation = useClaimCartsMutation();
	const [loading, setLoading] = React.useState(true);
	const previousAccessTokenRef = React.useRef<string | null>(null);

	// TODO: Find a way to handle this cleanly without depending on the `useEffect` crutch.
	React.useEffect(() => {
		const initAuth = async () => {
			if (!accessToken) {
				try {
					await refreshToken();
				} catch (error) {
					// Failed to refresh, user is not logged in
				}
			}
			setLoading(false);
		};

		initAuth();
	}, [accessToken]);

	// Claim guest carts after authentication
	React.useEffect(() => {
		const wasUnauthenticated = previousAccessTokenRef.current === null;
		const isNowAuthenticated = accessToken !== null;

		// If user just authenticated and has guest carts, claim them
		if (wasUnauthenticated && isNowAuthenticated && guestCartIds.length > 0) {
			claimCartsMutation.mutate(guestCartIds, {
				onSuccess: () => {
					clearGuestCarts();
				},
				onError: error => {
					console.error('Failed to claim guest carts:', error);
					// Still clear the guest carts to avoid repeated failed attempts
					clearGuestCarts();
				}
			});
		}

		previousAccessTokenRef.current = accessToken;
	}, [accessToken, guestCartIds, claimCartsMutation, clearGuestCarts]);

	if (loading) {
		return null;
	}

	return (
		<div>
			<MainNavigation />
			<div className='max-w-6xl mx-auto sm:pt-24 pb-18 px-4 pt-20'>
				{children}
			</div>
			<MobileTabBar />
			<AuthDrawer />
		</div>
	);
};

export default MainLayout;
