import foodDiscount from '../models/food-discount.js';
import cloudinaryStorage from '../../../services/cloudinary.service.js';
import { v4 as uuid } from 'uuid';

const createFoodDiscount = async (foodId, discount, discountTime, foodPartnerId) => {

    const food = await FoodModel.findById(foodId);

    if (!food) {
        throw new Error("Food not found");
    }

    if (food.foodPartner.toString() !== foodPartnerId.toString()) {
        throw new Error("You can only add discount to your own food items");
    }

    const newfoodDiscount = await foodDiscount.create({
        discount,
        discountTime,
        food: foodId
    });

    return newfoodDiscount;
};

const foodDiscountView = async () => {
    const foodDiscounts = await foodDiscount.find({}).populate({
        path: 'food',
        populate: {
            path: 'foodPartner',
        }
    });

    return foodDiscounts;
};

export default { createFoodDiscount, foodDiscountView };