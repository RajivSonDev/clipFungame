import { Component, OnInit } from '@angular/core';
import { EventBlockerDirective } from 'src/app/shared/directives/event-blocker.directive';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{

  isDragover = false

  constructor(){

  }

  ngOnInit(): void {
      
  }

  storeFile($event:Event){
    this.isDragover=false;
  }


}
