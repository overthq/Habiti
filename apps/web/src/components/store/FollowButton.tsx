'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '@/data/mutations';

interface FollowButtonProps {
	storeId: string;
	isFollowing?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
	storeId,
	isFollowing
}) => {
	const followStoreMutation = useFollowStoreMutation();
	const unfollowStoreMutation = useUnfollowStoreMutation();

	const handleClick = () => {
		if (isFollowing) {
			unfollowStoreMutation.mutate(storeId);
		} else {
			followStoreMutation.mutate(storeId);
		}
	};

	return (
		<Button
			variant='outline'
			disabled={isFollowing === undefined}
			onClick={handleClick}
			size='sm'
			className={cn(
				isFollowing &&
					'bg-transparent *:[svg]:fill-red-500 *:[svg]:stroke-red-500'
			)}
		>
			<HeartIcon />
			{isFollowing ? 'Following' : 'Follow'}
		</Button>
	);
};

export default FollowButton;
