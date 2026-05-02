import mongoose from 'mongoose';

const restaurantPpSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String
  },
  { _id: false }
);

const foodPartnerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    restaurantName: { type: String, required: true },
    restaurantAddress: { type: String, required: true },
    restaurantPp: restaurantPpSchema
}, { timestamps: true });

const FoodPartner = mongoose.model('foodPartner', foodPartnerSchema);

export default FoodPartner;