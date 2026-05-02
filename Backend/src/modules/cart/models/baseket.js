import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "food",
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const basketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Basket", basketSchema);