import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface Description {
    feature:   String[],
    details:   String,
    specifications: { [key: string]: String },
}

interface Images {
  "_id": string,
  "url": string,
  "alt": string
}

export interface Product extends Document {
    name: String,
    slug:         String,
    description:  Description,
    price:        number,
    discount:     number,
    finalPrice:   number,
    currency:     String,
    categoryId:   ObjectId | null,
    brand:        String,
    images:       Images[],
    stock:        number,
    isActive:     Boolean,
    ratingAvg:    number,
    ratingCount:  number,
    createdAt:    Date,
    updatedAt:    Date,
}

const ProductSchema = new Schema<Product>({
    name:         { type: String, required: true, index: true },
    slug:         { type: String, unique: true },
    description:  { 
        feature: [{ type: String }],
        details: { type: String },
        specifications: { 
            type: Map,
            of: String,
            default: {},
        } // list of specifications
    },
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

const Products = mongoose.models.Products || mongoose.model("Products", ProductSchema);
export default Products;