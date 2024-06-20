const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
        default : 100
    },
    taste: {
        type: String,
        enum: ['sweet', 'spicy', 'sour'],
        require : true
    },
    isDrink: {
        type: Boolean,
        default : false
    },
    ingredients: {
        type: [String],
        default: [],
    },
    numSales: {
        type: Number,
        default : 0,
    }
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;