import { model, Schema, Document } from 'mongoose';
import { UserDocument } from './User';
import { StoreDocument } from './Store';
import { ItemDocument } from './Item';

enum OrderStatus {
	Pending = 'Pending',
	Processing = 'Processing',
	Delivered = 'Delivered'
}

export interface OrderDocument extends Document {
	userId: string;
	user: UserDocument;
	storeId: string;
	store: StoreDocument;
	status: OrderStatus;
	cart: CartItemDocument[];
}

export interface CartItemDocument extends Document {
	itemId: string;
	item: ItemDocument;
	quantity: number;
}

const CartItemSchema = new Schema({
	itemId: {
		type: Schema.Types.ObjectId,
		ref: 'Item',
		required: true
	},
	quantity: {
		type: Number,
		required: true
	}
});

CartItemSchema.virtual('item', {
	ref: 'Item',
	localField: 'itemId',
	foreignField: '_id',
	justOne: true
});

const OrderSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		storeId: {
			type: Schema.Types.ObjectId,
			ref: 'Store',
			required: true
		},
		status: {
			type: String,
			enum: ['Pending', 'Processing', 'Delivered'],
			default: 'Pending'
		},
		cart: [CartItemSchema]
	},
	{ timestamps: true }
);

OrderSchema.virtual('user', {
	ref: 'User',
	localField: 'userId',
	foreignField: '_id',
	justOne: true
});

OrderSchema.virtual('store', {
	ref: 'Store',
	localField: 'storeId',
	foreignField: '_id',
	justOne: true
});

export const Order = model<OrderDocument>('Order', OrderSchema);
