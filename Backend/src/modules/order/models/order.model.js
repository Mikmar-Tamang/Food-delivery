import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'food',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
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
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'online'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
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

// Generate order number before saving
orderSchema.pre('save',function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;