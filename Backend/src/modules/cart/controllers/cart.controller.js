import cartService from "../services/cart.service.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const basket = await cartService.addToCart(
      req.user._id,
      req.body.foodId,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      basket
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const basket = await cartService.getCart(req.user._id);

    res.status(200).json({
      success: true,
      basket
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const basket = await cartService.removeFromCart(
      req.user._id,
      req.body.foodId
    );

    res.status(200).json({
      success: true,
      basket
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};