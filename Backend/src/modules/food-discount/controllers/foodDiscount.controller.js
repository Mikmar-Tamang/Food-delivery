import foodDiscountService from "../services/foodDiscount.service.js";

const createFoodDiscount = async (req, res) => {
  try {
    const result = await foodDiscountService.createFoodDiscount(
      req.body,
      req.foodPartner._id
    );

    res.status(201).json({
      message: "Food discount created successfully",
      foodDiscountAdded: result
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const foodDiscountView = async (req, res) => {
  try {
    const result = await foodDiscountService.foodDiscountView();

    res.status(200).json({
      message: "Discount list fetched",
      viewFoodDiscount: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export default { createFoodDiscount, foodDiscountView };