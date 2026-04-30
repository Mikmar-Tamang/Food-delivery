import Basket from "../models/Basket.js";

// ➕ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user._id; // ✅ comes from your middleware

    let basket = await Basket.findOne({ userId });

    if (!basket) {
      basket = new Basket({
        userId,
        items: [{ foodId, quantity: 1 }],
      });
    } else {
      const itemIndex = basket.items.findIndex(
        (item) => item.foodId.toString() === foodId
      );

      if (itemIndex > -1) {
        basket.items[itemIndex].quantity += 1;
      } else {
        basket.items.push({ foodId, quantity: 1 });
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

// 📦 GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const basket = await Basket.findOne({ userId }).populate("items.foodId");

    res.status(200).json({
      success: true,
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
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