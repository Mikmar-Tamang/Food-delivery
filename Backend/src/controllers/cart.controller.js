import Basket from "../models/Basket.js";

// ➕ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { foodId } = req.body;

    let basket = await Basket.findOne({ userId });

    // if no basket → create one
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
      message: "Added to basket",
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

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
    const userId = req.user.id;
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
      message: "Item removed",
      basket,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};