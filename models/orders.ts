import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export interface Order {
  userId: ObjectId | null,
  items: [
    {
      productId:  ObjectId | null,
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
    }
  ],
  shippingAddress: ObjectId | null,
  paymentId:       ObjectId | null,
  totalAmount:     Number,
  currency:        String,
  status:          String,
  placedAt:        Date,
  updatedAt:       Date,
};

const OrderSchema = new mongoose.Schema<Order>({
  userId:      { type: ObjectId, ref: "User", required: true, index: true },
  items: [
    {
      productId:  { type: ObjectId, ref: "Product" },
      name:       { type: String },
      price:      { type: Number },
      quantity:   { type: Number },
      total:      { type: Number },
    }
  ],
  shippingAddress: { type: ObjectId, ref: "Address" },
  paymentId:       { type: ObjectId, ref: "Payment" },
  totalAmount:     { type: Number, required: true },
  currency:        { type: String, default: "USD" },
  status:          { type: String, enum: ["pending","paid","shipped","delivered","cancelled","refunded"], default: "pending" },
  placedAt:        { type: Date, default: Date.now },
  updatedAt:       { type: Date, default: Date.now },
});

const Orders = mongoose.model<Order>("Order", OrderSchema);

export default Orders;