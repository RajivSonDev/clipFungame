import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showAlert = false;
  alertMsg='Please wait! We are logging you in.'
  alertColor='blue'
  inSubmission=false

  credentials={
    email:'',
    password:''
  }

  constructor(private auth:AngularFireAuth){

  }

  async login(){

      this.showAlert=true
      this.alertColor='blue'
      this.inSubmission=true
      this.alertMsg="Please wait! We are logging you in."
      
      try{
        await this.auth.signInWithEmailAndPassword(
          this.credentials.email,
          this.credentials.password
        )
      }catch(e){
        console.log(e);

        this.inSubmission=false
        this.alertMsg='An unexpected error occurred. Please try again later!'
        this.alertColor='red'
        
        console.log(e)
        
        return 
      }

      this.alertMsg='Success! You are now logged in.'
      this.alertColor='green'
  }
}
