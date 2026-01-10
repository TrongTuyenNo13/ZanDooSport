const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    category: { type: String, required: true }, 
    price: { type: Number, required: true },    
    image: { type: String, required: true },    
    description: { type: String, required: true },  
    inStock: { type: Boolean, default: true },  
    size: { type: [String], default: [] },
    rating: { type: Number, default: 5 },
    sold: { type: Number, default: 0 },
},  { timestamps: true });

module.exports =  mongoose.model('Product', ProductSchema);