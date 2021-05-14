const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const ItemSchema = new mongoose.Schema({
//     _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, required: true },
//     totalItemPrice: { type: Number, required: true },
//     quantity: { type: Number, required: true },
// })

const cartSchema = new Schema({
    // customerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    items: [
        {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            totalItemPrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalQuantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
})

module.exports = mongoose.model('Cart', cartSchema)