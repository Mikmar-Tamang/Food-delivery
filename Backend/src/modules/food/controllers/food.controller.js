import foodService from "../services/food.service.js";

const createFood = async (req, res) => {
  try {
    const foodItem = await foodService.createFood(
      req.body,
      req.file,
      req.foodPartner._id
    );

    res.status(201).json({
      message: "Food item created successfully",
      food: foodItem
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getAllFood = async (req, res) => {
  try {
    const foodItems = await foodService.getAllFood();

    res.status(200).json({
      message: "Food items fetched successfully",
      food: foodItems
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export default {
  createFood,
  getAllFood
};