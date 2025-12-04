import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface Product extends Document {
    name: String,
    slug:         String,
    description:  String,
    price:        Number,
    discount:     Number,
    finalPrice:   Number,
    currency:     String,
    categoryId:   ObjectId | null,
    brand:        String,
    images:       [{ url: String, alt: String }],
    stock:        Number,
    isActive:     Boolean,
    ratingAvg:    Number,
    ratingCount:  Number,
    createdAt:    Date,
    updatedAt:    Date,
}

const ProductSchema = new Schema<Product>({
    name:         { type: String, required: true, index: true },
    slug:         { type: String, unique: true },
    description:  { type: String },
    price:        { type: Number, required: true },
    discount:     { type: Number, default: 0 }, // percent
    finalPrice:   { type: Number, required: true }, // price - discount
    currency:     { type: String, default: "USD" },
    categoryId:   { type: ObjectId, ref: "Categories", default: null },
    brand:        { type: String },
    images:       [{ url: String, alt: String }],
    stock:        { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
    ratingAvg:    { type: Number, default: 0 },
    ratingCount:  { type: Number, default: 0 },
    createdAt:    { type: Date, default: Date.now },
    updatedAt:    { type: Date, default: Date.now },
});

export const Products = mongoose.model<Product>("Products", ProductSchema);