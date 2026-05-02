import cartService from "../services/cart.service.js";

// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const basket = await cartService.addToCartService(
            req.user._id,
            foodId,
            quantity
        );

        res.status(200).json({
            success: true,
            basket,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// GET CART
const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const basket = await cartService.getCartService(req.user._id);

        res.status(200).json({
            success: true,
            basket,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const basket = await cartService.removeFromCartService(
            req.user._id,
            foodId
        );

        res.status(200).json({
            success: true,
            basket,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export default {
    addToCart,
    getCart,
    removeFromCart,
};