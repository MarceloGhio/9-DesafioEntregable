import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const cartSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, required: true },
    products: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;