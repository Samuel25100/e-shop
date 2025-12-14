import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export interface Address {
    line1: string,
    line2?: string,
    city: string,
    country: string,
    postalCode?: string,
}
export interface User {
    name: string,
    email: string,
    password: string,
    profile?: string,
    role: string,
    phone: string,
    addresses: Address,
    wishlist: ObjectId[],
    cartId: ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const UserSchema = new mongoose.Schema<User>({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, index: true },
  password:     { type: String, required: true },
  profile:      {type: String},
  role:         { type: String, enum: ["user", "admin"], default: "user" },
  phone:        { type: String },
  addresses:   {
    line1:        { type: String, required: true },
    line2:        { type: String },
    city:         { type: String, required: true },
    country:      { type: String, required: true },
    postalCode:   { type: String },
  },
  wishlist:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cartId:       { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
});

const Users = mongoose.models.User || mongoose.model("User", UserSchema);

export default Users;