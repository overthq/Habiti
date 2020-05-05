import { model, Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
	name: string;
	phone: string;
}

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true,
			unique: true
		}
	},
	{ timestamps: true }
);

export const User = model<UserDocument>('User', UserSchema);
