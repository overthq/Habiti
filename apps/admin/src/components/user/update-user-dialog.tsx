import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

const UpdateUserDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Update User</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update User</DialogTitle>
					<DialogDescription>
						Update the user's details below.
					</DialogDescription>
				</DialogHeader>
				<div></div>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUserDialog;
