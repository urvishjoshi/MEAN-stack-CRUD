import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../item/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }

  data=null
  nodeUrl = 'http://localhost:3000/'

  ngOnInit(): void {
    this.api.getData().subscribe(data => { console.log(data);this.data = data})
  }

  addToCart(itemId) {
    this.api.addToCart(itemId).subscribe(data => {
      console.log('cart');
      console.log(data);
      this.data = data
    })
  }

  removeFromCart(itemId) {
    this.api.removeFromCart(itemId).subscribe(data => {
      console.log('cart');
      console.log(data);
      this.data = data
    })
  }

  removeItemFromCart(itemId) {
    this.api.removeItemFromCart(itemId).subscribe(data => {
      console.log('cart');
      console.log(data);
      this.data = data
    })
  }

}
