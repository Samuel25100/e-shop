import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export interface Review {
  productId:   ObjectId | null,
  userId:      ObjectId | null,
  rating:      Number,
  comment:     String,
  createdAt:   Date,
}
const ReviewSchema = new mongoose.Schema<Review>({
  productId:   { type: ObjectId, ref: "Product", required: true },
  userId:      { type: ObjectId, ref: "User", required: true },
  rating:      { type: Number, min: 1, max: 5, required: true },
  comment:     { type: String },
  createdAt:   { type: Date, default: Date.now },
});

const Reviews = mongoose.model<Review>("Review", ReviewSchema);

export default Reviews;