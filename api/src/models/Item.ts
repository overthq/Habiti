import { model, Schema, Document } from 'mongoose';
import { StoreDocument } from './Store';

enum ItemUnit {
	Kilogram = 'Kilogram',
	Litre = 'Litre'
}

export interface ItemDocument extends Document {
	name: string;
	storeId: string;
	store: StoreDocument;
	unit: string;
	pricePerUnit: number;
	featured: boolean;
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
			enum: Object.values(ItemUnit)
		},
		pricePerUnit: {
			type: Number,
			required: true
		},
		featured: {
			type: Boolean,
			default: false
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
