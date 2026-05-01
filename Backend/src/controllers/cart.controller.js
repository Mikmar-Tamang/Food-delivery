import Basket from "../models/baseket.js";

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user._id; // ✅ comes from your middleware

      if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

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

    res.status(200).json({
      success: true,
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const basket = await Basket.findOne({ userId }).populate("items.foodId");

    res.status(200).json({
      success: true,
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    const basket = await Basket.findOne({ userId });

    if (!basket) {
      return res.status(404).json({ message: "Basket not found" });
    }

    basket.items = basket.items.filter(
      (item) => item.foodId.toString() !== foodId
    );

    await basket.save();

    res.status(200).json({
      success: true,
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};