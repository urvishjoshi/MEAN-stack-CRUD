const itemController = require('./controllers/itemController');
const cartController = require('./controllers/cartController');

module.exports = (app, multipartMiddleware='') => { const _ = '/api'
    
    app.get(_+'/items', itemController().index)
    app.post(_ + '/item/add', itemController().add)
    app.post(_+'/item/edit', itemController().edit)
    app.post(_+'/item/:item', itemController().itemDuplicate)
    app.post(_+'/delete/:item', itemController().delete)
    app.post(_+'/addtocart', cartController().addToCart)
    app.post(_+'/removefromcart', (req, res) => {cartController().removeFromCart(req, res)})
    app.post(_+'/removeItemFromCart', cartController().removeItemFromCart)
    // app.post(_+'/upload', multipartMiddleware, (req, res) => {
    // 	res.json({'message':req.files});
    // })
}