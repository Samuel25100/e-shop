import mongoose from "mongoose";
import { ObjectId } from "mongodb";

interface Wishlist {
  userId:      ObjectId | null,
  products:    ObjectId [],
  createdAt:   Date
}

const WishlistSchema = new mongoose.Schema<Wishlist>({
  userId:      { type: ObjectId, ref: "User", required: true },
  products:    [{ type: ObjectId, ref: "Product" }],
  createdAt:   { type: Date, default: Date.now }
});

const Wishlists = mongoose.model<Wishlist>("Wishlist", WishlistSchema);

export default Wishlists;