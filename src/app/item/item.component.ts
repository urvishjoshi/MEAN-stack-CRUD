import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Item } from './item';
import { Observable } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { ChatService } from './chat/chat.service';

interface itemType{
  name: string,
  price:number,
  image:string
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  data = null
  nodeUrl = 'http://localhost:3000/';

  constructor(private modalService: NgbModal, private api: ApiService, private chat: ChatService) {
  }
  
  ngOnInit(): void {
    this.api.getData().subscribe(data => {
      console.log(data)
      this.data = data
    })
  }
  
  file = []
  uploadedFiles: Array<File>;

  fileUpload(e) {
    this.uploadedFiles = e.target.files
  }

  addItemForm(form) {
    let formData = new FormData();
    for(var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("itemImage", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    formData.append('itemName', form.value.itemName)
    formData.append('itemPrice', form.value.itemPrice)
    this.api.addItem(formData).subscribe(data => { console.log(data); })
    form.reset()
  }

  upload(){
    let formData = new FormData();
    for(var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("itemImage", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    this.api.addItem(formData).subscribe(data => { console.log('received:',data); })
  }

  openVerticallyCentered(content: ModalComponent) {
    this.modalService.open(content, { centered: true });
  }

}
