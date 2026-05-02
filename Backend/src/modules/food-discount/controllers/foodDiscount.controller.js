import foodDiscountService from "../services/foodDiscount.service.js";

const createFoodDiscount = async (req, res) => {
    try {
        const newDiscount = await foodDiscountService.createFoodDiscount(
            req.body.foodId,
            req.body.discount,
            req.body.discountTime,
            req.foodPartner._id
        );

        res.status(201).json({
            message: "Food discount has been created successfully",
            foodDiscountAdded: newDiscount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const foodDiscountView = async (req, res) => {
    try {
        const discounts = await foodDiscountService.foodDiscountView();

        res.status(200).json({
            message: "You have added discount in food",
            viewFoodDiscount: discounts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export default { createFoodDiscount, foodDiscountView };