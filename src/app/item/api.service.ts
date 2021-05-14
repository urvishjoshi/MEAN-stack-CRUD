import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = "http://localhost:3000/api/";

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.url + 'items')
  }

  addItem(item) {
    return this.http.post(this.url + 'upload', item)
  }
  
  addToCart(itemId) {
    return this.http.post(this.url + 'addtocart', {itemId})
  }

  removeFromCart(itemId) {
    return this.http.post(this.url + 'removefromcart', {itemId})
  }

  removeItemFromCart(itemId) {
    return this.http.post(this.url + 'removeitemfromcart', {itemId})
  }
}
