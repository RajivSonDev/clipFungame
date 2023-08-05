import { Component } from '@angular/core';
import { ModalService } from '../service/modal.service';
import { AuthService } from '../service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isAuthenticated=false

  constructor(public modal:ModalService, public auth:AuthService,private afAuth:AngularFireAuth){
    this.auth.isAuthenticated$.subscribe(status => {                                     // observer
        this.isAuthenticated=status
    })
  } 

  openModal($event:Event){
    $event.preventDefault() // it will be prevent defualt behaviour of the browser 
    this.modal.toggleModal('auth')
  }

  async logout($event:Event){            // it is asychronous process 
    $event.preventDefault()
    await this.afAuth.signOut()         // wait for the process to get done
  }

}
