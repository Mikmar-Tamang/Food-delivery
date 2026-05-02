import FoodModel from '../models/food.model.js';
import cloudinaryStorage from '../../../services/cloudinary.service.js';
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

export default { createFood, getAllFood };