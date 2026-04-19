import mongoose from "mongoose";

const foodDiscountSchema= new mongoose.Schema({
    discount:{type: String, required: true},
    discountTime: {type: String, required: true},
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
    
}, {timestamps: true})

const foodDiscount= mongoose.model('foodDiscount', foodDiscountSchema);

export default foodDiscount;