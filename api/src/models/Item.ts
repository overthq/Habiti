import { model, Schema, Document } from 'mongoose';
import { StoreDocument } from './Store';

export interface ItemDocument extends Document {
	name: string;
	storeId: string;
	store: StoreDocument;
	unit: string;
}

const ItemSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		storeId: {
			type: Schema.Types.ObjectId,
			ref: 'Store',
			required: true
		},
		unit: {
			type: String,
			enum: ['']
		},
		pricePerUnit: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

ItemSchema.virtual('store', {
	ref: 'Store',
	localField: 'storeId',
	foreignField: '_id',
	justOne: true
});

export const Item = model<ItemDocument>('Item', ItemSchema);
