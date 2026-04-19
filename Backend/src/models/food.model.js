import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner', required: true }
}, { timestamps: true });

const foodModel = mongoose.model('food', foodSchema);

export default foodModel;