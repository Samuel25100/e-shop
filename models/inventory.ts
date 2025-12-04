import mongoose from "mongoose";
import { ObjectId } from "mongodb";

interface Inventory {
    productId:   ObjectId | null,
    change:      Number, 
    reason:      String,
    referenceId: ObjectId | null, 
    createdAt:   Date,
    createdBy:   ObjectId | null,
 }

const InventorySchema = new mongoose.Schema<Inventory>({
    productId:   { type: ObjectId, ref: "Product", required: true },
    change:      { type: Number, required: true },
    reason:      { type: String, enum: ["sale","refund","restock","adjustment"], required: true },
    referenceId: { type: ObjectId, ref: "Order" },
    createdAt:   { type: Date, default: Date.now },
    createdBy:   { type: ObjectId, ref: "User", required: true },
});

const Inventory = mongoose.model<Inventory>("Inventory", InventorySchema);

export default Inventory;