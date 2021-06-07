import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Observer } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private name: String

  constructor() {
    this.socket = io('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']});
  }

  joinChat(name) {
    this.name = name
    this.socket.emit('join', name)
  }
  
  getChat(name) {
    this.name = name
    this.socket.emit('getChat', name)
  }

  message() {
    let observable = new Observable(observer => {
      this.socket.on('receivedMsg', (msg) => {
        console.log('receivedMsg', msg)
        observer.next(msg);
      })
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  }
  
  chatExists() {
    let observable = new Observable(observer => {
      this.socket.on(this.name+'chatExists', (chat) => {
        console.log(this.name+'chatExists', chat)
        observer.next(chat);
      })
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  }

  sendMsg(msg, sender) {
    this.socket.emit('message', {msg, sender})
  }
}
