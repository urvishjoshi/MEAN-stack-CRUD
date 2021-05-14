
export class Data {
  items: Item = new Item()
  cart: Item = new Item()
}

class Item {
  _id : any
  name: string
  price: number
  image: string
}
class Cart {
  CartItem: CartItem = new CartItem()
  totalQuantity: number
  totalPrice: number
}
class CartItem {
  _id : any
  name: string
  price: number
  image: string
  totalItemPrice: number
  quantity: number
}

