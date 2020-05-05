import { model, Schema, Document } from 'mongoose';

export interface StoreDocument extends Document {
	name: string;
	websiteUrl?: string;
	instagramUrl?: string;
	twitterUrl?: string;
}

const StoreSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		websiteUrl: {
			type: String
		},
		instagramUrl: {
			type: String
		},
		twitterUrl: {
			type: String
		}
	},
	{ timestamps: true }
);

export const Store = model<StoreDocument>('Store', StoreSchema);
