const fs = require("fs");
const moment = require('moment');
const Item = require('../models/item');
const Cart = require('../models/cart');

// const getFileData = (file = 'items', item = false) => {
//     let data = JSON.parse(fs.readFileSync(`./db/${file}.json`, 'utf-8', err => console.log(err)))
//     return data
// }

// const setFileData = (data) => {
//     return fs.writeFileSync('./db/items.json', JSON.stringify(data), 'utf-8', err => console.log(err) )
// }

function itemController() {
    return {
        async index(req, res) {
            Item.find().then(items => {
                
                Cart.find().then(cart => {
                    res.json({ items, cart })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({error: err})
            })
        },
        
        add(req, res) {
            const { itemName, itemPrice } = req.body

            let image = req.files.itemImage

            let image_name = 'uploads/' + image.path.replace('public'+'/'+'uploads'+'/', '')

            const newItem = {
                name: itemName,
                price: itemPrice,
                image: image_name
            }
            
            Item.create(newItem).then(() => {
                return res.json({ success: 'Save successful' })
            }).catch(err => {
                return res.json({ msg: 'Save unsuccessful', err })
            })

        },

        doAdd(req, res) {
            const { itemName, itemPrice } = req.body

            let image = req.files.itemImage
            
            let image_name = 'uploads/' + moment().format('YYYYMMDDHHmmss') + image.name
            
            const newData = {
                name: itemName,
                price: itemPrice,
                image: image_name
            }

            let json = fs.readFileSync('./db/items.json', 'utf-8', err => fs.closeSync(fs.openSync('./db/items.json', 'w')) )

            if(json != undefined && json.length > 0) {
                obj = JSON.parse(json);
                obj.push(newData);
                json = JSON.stringify(obj)
            } else {
                json = JSON.stringify([newData])
            }

            fs.writeFile('./db/items.json', json, 'utf-8', err => console.log(err) )
            image.mv('public/'+image_name, err => {
                if (err) req.flash('error', err)
                else req.flash('success', 'Save successful')
                return res.redirect('/add')
            })
        },

        edit(req, res) {
            const { editItem, itemName, itemPrice } = req.body
            
            const data = getFileData()
            let item = data[editItem]
            
            if(req.files){
                fs.unlink('public/' + data[editItem].image, err => {
                    if (err) req.flash('error', 'Old image remove failed')
                })
                let image = req.files.itemImage
                let image_name = 'uploads/' + moment().format('YYYYMMDDHHmmss') + image.name
                item.image = image_name
                image.mv('public/' + image_name, err => { if (err) req.flash('error', err) })
            }

            item.name = itemName
            item.price = itemPrice
            data[editItem] = item

            setFileData(data)
            req.flash('success', 'Edit successful')
            return res.redirect('/add')
        },

        delete(req, res) {
            let item = req.params.item

            const data = getFileData()
            const image = data[item].image
            if(data.splice(item, 1)) {
                fs.unlink('public/'+image, err=> {
                    if (err) req.flash('error', 'Item delete failed')
                    else{
                        setFileData(data);
                        req.flash('success', 'Item delete successful')
                    }
                    return res.redirect('/add')
                })
            }
        },

        itemDuplicate(req, res) {
            const itemName = req.params.item
            const data = getFileData()
            if(data.length==0) return res.json('1')
            var count = {};
            let unique = true
            data.forEach(item => {
                count[item.name] = (count[item.name] || 0) + 1;
                if ((count[itemName] > 0) && (item.name!=itemName)) unique = false
            });

            if(unique) return res.json('1')
            return res.json('0')
        }
    }
}

module.exports = itemController