import { Component } from '@angular/core';
import { ModalService } from '../service/modal.service';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isAuthenticated=false

  constructor(public modal:ModalService, 
    public auth:AuthService){
    this.auth.isAuthenticated$.subscribe(status => {                                     // observer
        this.isAuthenticated=status
    })
  } 

  openModal($event:Event){
    $event.preventDefault() // it will be prevent defualt behaviour of the browser 
    this.modal.toggleModal('auth')
  }

  
}
