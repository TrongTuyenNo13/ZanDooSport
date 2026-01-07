const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên: Giày Nike Mercurial
    category: { type: String, required: true }, // Loại: Giày bóng đá
    price: { type: Number, required: true },    // Giá tiền
    image: { type: String, required: true },    // Link ảnh sản phẩm
    description: { type: String, required: true },  // Mô tả chi tiết
    inStock: { type: Boolean, default: true },  // Còn hàng hay không
},  { timestamps: true });

module.exports =  mongoose.model('Product', ProductSchema);