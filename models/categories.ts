import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export interface Category {
  name:        String,
  slug:       String,
  parentId:   ObjectId | null,
  description: String,
  createdAt:  Date,
}

const CategorySchema = new mongoose.Schema<Category>({
    name:        { type: String, required: true },
    slug:        { type: String, unique: true },
    parentId:    { type: ObjectId, ref: "Categories", default: null },
    description: { type: String },
    createdAt:   { type: Date, default: Date.now },
});

export const Categories = mongoose.model<Category>("Categories", CategorySchema);