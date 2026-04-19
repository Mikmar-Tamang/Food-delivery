import foodDiscount from '../models/food-discount.js';
import FoodModel from '../models/food.model.js';
import cloudinaryStorage from '../services/cloudinary.service.js';
import { v4 as uuid } from 'uuid';

const createFood = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file provided');
    }

    try {
        const imageUrl = await cloudinaryStorage.uploadImage(req.file.buffer, {
          folder: 'food-image',
          fileName: `food ${uuid()}`
        });
        const foodItem= await FoodModel.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
           image: {
            url: imageUrl.url,
            public_id: imageUrl.public_id
  },
            foodPartner: req.foodPartner._id
        });

        res.status(201).json({
            message: 'Food item created successfully',
            food: foodItem
        });

    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).send('Error uploading image');
    }
};

const getAllFood = async (req, res) => {
    try {
        const foodItems = await FoodModel.find({}).populate('foodPartner');
        res.status(200).json({
            message: 'Food items fetched successfully',
            food: foodItems
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).send('Error fetching food items');
    }
};

const createFoodDiscount= async (req, res) => {
  try{
    const food = await FoodModel.findById(req.body.foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.foodPartner.toString() !== req.foodPartner._id.toString()) {
      return res.status(403).json({
        message: "You can only add discount to your own food items"
      });
    }
         const newfoodDiscount= await foodDiscount.create({
            discount: req.body.discount,
            discountTime: req.body.discountTime,
            food: req.body.foodId
         });

         res.status(201).json({
            message: "Food discount has been created successfully",
           foodDiscountAdded: newfoodDiscount
         });
  }catch(error){
 res.status(500).send('Error in food discount')
  }
}

const foodDiscountView= async (req, res) => {
    try{
    const foodDiscounts= await foodDiscount.find({}).populate({
        path:'food',
        populate: {
            path:'foodPartner',
        }
    })

    console.log(JSON.stringify(foodDiscounts, null, 2));

    res.status(200).json({
        message:"You have added discount in food",
        viewFoodDiscount: foodDiscounts 
    })
    } catch (err){
       console.error('Error fetching food discount:', err);
        res.status(500).send('Error fetching food discount');
    }
}



export default { createFood, getAllFood, createFoodDiscount, foodDiscountView };