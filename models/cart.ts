import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export interface Cart {
    userId: ObjectId | null,
    items: [
        {
        productId:  ObjectId, quantity: Number, price: Number, total: Number,
        }
    ],
    totalItems:  Number,
    totalPrice:  Number,
    currency:    String,
    updatedAt:   Date
}

const CartSchema = new mongoose.Schema<Cart>({
  userId:      { type: ObjectId, ref: "User", required: true, index: true },
  items: [
    {
      productId:  { type: ObjectId, ref: "Product", required: true },
      quantity:   { type: Number, default: 1 },
      price:      { type: Number, required: true }, // snapshot of product price
      total:      { type: Number, required: true },
    }
  ],
  totalItems:  { type: Number, default: 0 },
  totalPrice:  { type: Number, default: 0 },
  currency:    { type: String, default: "USD" },
  updatedAt:   { type: Date, default: Date.now }

});
const Carts = mongoose.model<Cart>("Cart", CartSchema);

export default Carts;