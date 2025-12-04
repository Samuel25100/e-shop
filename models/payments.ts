import mongoose from "mongoose";
import { ObjectId } from "mongodb";

enum Status {
    Pending = "pending",
    Completed = "completed",
    Failed = "failed",
    Refunded = "refunded"
}
export interface Payment {
    orderId:     ObjectId | null,
    userId:      ObjectId | null,
    method:      String,
    transactionId: String,
    amount:      Number,
    currency:    String,
    status:      Status,
    paidAt:      Date,
    createdAt:   Date,
}

const PaymentSchema = new mongoose.Schema<Payment>({
    orderId:     { type: ObjectId, ref: "Order", required: true },
    userId:      { type: ObjectId, ref: "User", required: true },
    method:      { type: String, enum: ["card","mobile_money","paypal","cash_on_delivery"], required: true },
    transactionId: { type: String },
    amount:      { type: Number, required: true },
    currency:    { type: String, default: "USD" },
    status:      { type: String, enum: Object.values(Status), default: Status.Pending },
    paidAt:      { type: Date },
    createdAt:   { type: Date, default: Date.now },
});

const Payments = mongoose.model<Payment>("Payment", PaymentSchema);

export default Payments;