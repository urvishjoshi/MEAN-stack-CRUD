import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChatService } from './chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import lookup from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {

  // content:any;
  @ViewChild('content', { static: true }) private content;
  @ViewChild('msgDiv') div: ElementRef;
  sendText: String
  name: String

  constructor(private chat: ChatService, private modalService: NgbModal) {
    this.chat.chatExists().subscribe(data => {
      this.loop(data)
    })
    this.chat.message().subscribe(data => { 
      this.receiveNewMsg(data)
    })
  }

  ngOnInit(): void {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false})
  }
  
  getName(modal) {
    modal.dismiss()
    this.chat.joinChat(this.name)
    this.chat.getChat(this.name)
  }

  receiveNewMsg(msg) {
    this.div.nativeElement.insertAdjacentHTML('beforeend', `
      <div class="incoming_msg">
          <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
          <div class="received_msg">
              <div class="received_withd_msg">
                  <p>${msg}</p>
                  <span class="time_date"> 11:01 AM | Today</span>
              </div>
          </div>
      </div>
    `);
  }

  sendNewMsg(msg) {
    this.div.nativeElement.insertAdjacentHTML('beforeend', `
      <div class="outgoing_msg">
          <div class="sent_msg">
              <p>${msg}</p>
              <span class="time_date"> 11:01 AM | Today</span>
          </div>
      </div>
    `);
  }
  
  sendBtn(msg) {
    if(msg.length < 1 || msg==' ') return false;

    this.chat.sendMsg(msg, this.name)
    
    this.sendNewMsg(msg)
    
    this.sendText = ''
  }

  loop(chat) {
    chat.map(oneMsg => {
      oneMsg = oneMsg.split(':')
      if(oneMsg[0] == this.name)
        this.sendNewMsg(oneMsg[1])
      else
        this.receiveNewMsg(oneMsg[1])
    })
  }
}
