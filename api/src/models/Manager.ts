import { model, Schema, Document } from 'mongoose';
import { StoreDocument } from './Store';

enum RoleEnum {
	Admin = 'Admin',
	Editor = 'Editor'
}

export interface ManagerDocument extends Document {
	name: string;
	email: string;
	role: RoleEnum;
	storeId: string;
	store: StoreDocument;
}

const ManagerSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		role: {
			type: String,
			enum: Object.values(RoleEnum),
			default: 'Editor'
		},
		storeId: {
			type: Schema.Types.ObjectId,
			ref: 'Store'
		}
	},
	{ timestamps: true }
);

ManagerSchema.virtual('store', {
	ref: 'Store',
	localField: 'storeId',
	foreignField: '_id',
	justOne: true
});

export const Manager = model<ManagerDocument>('Manager', ManagerSchema);
