import FoodModel from '../models/food.model.js';
import cloudinaryStorage from '../../../services/cloudinary.service.js';
import { v4 as uuid } from 'uuid';

// CREATE FOOD (clean service)
const createFood = async (body, file, foodPartnerId) => {
    if (!file) {
        throw new Error('No image file provided');
    }

    const imageUrl = await cloudinaryStorage.uploadImage(file.buffer, {
        folder: 'food-image',
        fileName: `food-${uuid()}`
    });

    const foodItem = await FoodModel.create({
        name: body.name,
        description: body.description,
        price: body.price,
        image: {
            url: imageUrl.url,
            public_id: imageUrl.public_id
        },
        foodPartner: foodPartnerId
    });

    return foodItem;
};

const getAllFood = async () => {
    const foodItems = await FoodModel.find({}).populate('foodPartner');
    return foodItems;
};

export default { createFood, getAllFood };