import Basket from "../models/baseket.js";

const addToCartService = async (userId, foodId, quantity) => {
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    let basket = await Basket.findOne({ userId });

    if (!basket) {
        basket = new Basket({
            userId,
            items: [{ foodId, quantity: qty }],
        });
    } else {
        const itemIndex = basket.items.findIndex(
            (item) => item.foodId.toString() === foodId
        );

        if (itemIndex > -1) {
            basket.items[itemIndex].quantity += qty;
        } else {
            basket.items.push({ foodId, quantity: qty });
        }
    }

    await basket.save();
    return basket;
};

const getCartService = async (userId) => {
    const basket = await Basket.findOne({ userId })
        .populate("items.foodId");

    return basket;
};

const removeFromCartService = async (userId, foodId) => {
    const basket = await Basket.findOne({ userId });

    if (!basket) {
        throw new Error("Basket not found");
    }

    basket.items = basket.items.filter(
        (item) => item.foodId.toString() !== foodId
    );

    await basket.save();
    return basket;
};

export default {
    addToCartService,
    getCartService,
    removeFromCartService,
};