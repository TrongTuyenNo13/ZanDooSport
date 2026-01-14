const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {type: String, defautlt: 'Guest' },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [
        {
            productId: String,
            name: String,
            quantity: Number,
            size: String,
            price: Number,
            image: String
        }
    ],
    
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Chờ xử lý' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);