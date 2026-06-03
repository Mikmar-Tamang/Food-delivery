import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  partner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner', required: true },
    restaurantName: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 50 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod'], default: 'cod' },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready', 'delivered', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  acceptedAt: Date,
  readyAt: Date,
  deliveredAt: Date,
  rejectedAt: Date
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;