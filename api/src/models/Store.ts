import { model, Schema, Document } from 'mongoose';

export interface StoreDocument extends Document {
	name: string;
	shortName: string;
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
		shortName: {
			type: String,
			unique: true,
			required: true
		},
		websiteUrl: {
			type: String
		},
		instagramUsername: {
			type: String
		},
		twitterUsername: {
			type: String
		}
	},
	{ timestamps: true }
);

export const Store = model<StoreDocument>('Store', StoreSchema);
