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

const getPartnerDiscounts = async (foodPartnerId) => {
    const discounts = await foodDiscount.find({}).populate({
        path: 'food',
        match: { foodPartner: foodPartnerId },
        populate: {
            path: 'foodPartner'
        }
    });
    
    // Filter out discounts where food is null (not matching partner)
    const validDiscounts = discounts.filter(discount => discount.food !== null);
    return validDiscounts;
};

const deleteFoodDiscount = async (discountId, foodPartnerId) => {
    const discount = await foodDiscount.findById(discountId).populate('food');
    
    if (!discount) {
        throw new Error("Discount not found");
    }
    
    // Verify discount belongs to partner's food
    if (discount.food.foodPartner.toString() !== foodPartnerId.toString()) {
        throw new Error("Unauthorized to delete this discount");
    }
    
    await foodDiscount.findByIdAndDelete(discountId);
    return { message: "Discount removed successfully" };
};

export default { createFoodDiscount, foodDiscountView, getPartnerDiscounts, deleteFoodDiscount };