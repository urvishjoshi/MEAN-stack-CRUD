import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Item } from './item';
import { Observable } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';

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

  constructor(private modalService: NgbModal, private api:ApiService) {
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

  addItemForm(item) {
    // item.itemImage = this.file
    console.log(item);
    let formData = new FormData();
    for(var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("itemImage", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    console.log(formData['itemImage']);
    // let formData = new FormData();
    // for (var i = 0; i < this.file.length; i++) {
    //   formData.append("itemImage[]", this.file[i], this.file[i].name);
    // }
    // this.http.post('/api/upload', formData)
    //   .subscribe((response) => {
    //     console.log('response received is ', response);
    //   })
    // this.api.addItem(formData).subscribe(data => { console.log(data); })
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
