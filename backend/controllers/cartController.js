const fs = require("fs");
const moment = require('moment');
const Item = require('../models/item');
const Cart = require('../models/cart');

// const getFileData = (item = false) => {
//     let file = fs.readFileSync('./db/cart.json', 'utf-8', err => {
//         fs.readFileSync('./db/cart.json', 'utf-8', err => fs.closeSync(fs.openSync('./db/cart.json', 'w')))
//     })
//     if (file == '' || file.length < 1) file = '[]'

//     let data = JSON.parse(file)
//     if (!item) return data
//     return data[item]
// }

// const setFileData = (data) => {
//     return fs.writeFileSync('./db/cart.json', JSON.stringify(data), 'utf-8', err => console.log(err))
// }
function cartController() {
    return {
        async addToCart(req, res) {
            const { itemId } = req.body

            let item = await Item.findById(itemId)

            let cart = await Cart.findOne()
            if(!cart){
                cart = {
                    items: [],
                    totalQuantity: 0,
                    totalPrice: 0
                }
                cart = await Cart.create(cart)
            }

            let exists = cart.items.find(item => item._id == itemId);
            if(exists) {
                exists.totalItemPrice += exists.price
                exists.quantity += 1
                cart.totalQuantity += 1
                cart.totalPrice += exists.price
                cart = await Cart.findByIdAndUpdate(cart._id, {$set:cart}, { new: true, useFindAndModify: false })
            }
            else{   //newly added
                cart.totalQuantity += 1
                cart.totalPrice += item.price
                let newItem = {...item._doc}
                newItem.totalItemPrice = parseInt(item.price)
                newItem.quantity = 1
                cart.items.push(newItem)
                
                cart.save()
            }
            console.log(exists)
            
            if (cart) {    // existing item
                
            }
            Item.find().then(items => {

                Cart.find().then(cart => {
                    res.json({ items, cart })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({ error: err })
            })
        },

        async removeFromCart(req, res) {
            const { itemId } = req.body

            let item = await Item.findById(itemId)

            let cart = await Cart.findOne()

            let exists = cart.items.find(item => item._id == itemId);
            if(exists.quantity > 2) {
                exists.totalItemPrice -= exists.price
                exists.quantity -= 1
                cart.totalQuantity -= 1
                cart.totalPrice -= exists.price
                cart.save()
            }

            // if (cart) {    // existing item
                
            //     cart = await Cart.findByIdAndUpdate(cart._id, {$set:cart}, { new: true, useFindAndModify: false })
            // }
            // else{   //newly added
            //     cart.totalQuantity += 1
            //     cart.totalPrice += item.price
            //     let newItem = {...item._doc}
            //     newItem.totalItemPrice = parseInt(item.price)
            //     newItem.quantity = 1
            //     cart.items.push(newItem)
                
            //     cart = await Cart.create(cart)
            // }
            Item.find().then(items => {

                Cart.find().then(cart => {
                    res.json({ items, cart })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({ error: err })
            })
        },

        async removeItemFromCart(req, res) {
            const { itemId } = req.body

            let item = await Item.findById(itemId)

            let cart = await Cart.findOne()

            let exists = cart.items.find(item => item._id == itemId);
            const index = cart.items.indexOf(exists);
            if (index > -1) {
              (cart.items).splice(index, 1);
            }
            cart.save()

            Item.find().then(items => {

                Cart.find().then(cart => {
                    res.json({ items, cart })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({ error: err })
            })
        }

    }
}

module.exports = cartController