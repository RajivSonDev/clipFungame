import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/service/auth.service';
import IUser from 'src/app/model/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  inSubmission=false
  
  constructor(
    private auth:AuthService,
    private emailTaken:EmailTaken
    ){}

  name=new FormControl('',[
    Validators.required,                  // validator will force the value
    Validators.minLength(3)
  ])
  email=new FormControl<number | null>(null,[
    Validators.email,
    Validators.required,
  ],[this.emailTaken.validate])
  age=new FormControl('',[
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password=new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirm_password=new FormControl('',[
    Validators.required,
  ])   
  phoneNumber=new FormControl('',[
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  showAlert=false
  alertMsg="please wait! Your account is being created."
  alertColor='blue'


  registerForm=new FormGroup({
   name:this.name,
   email:this.email,
   age:this.age,
   password:this.password,
   confirm_password:this.confirm_password,
   phoneNumber:this.phoneNumber
  },[RegisterValidators.match('password','confirm_password')])  // we are sending function as reference so angular 
  //can call the function



  /*The async keyword allows functions to be defined in a sequential,
   synchronous manner (although the execution will be asynchronous). The 
   await keyword makes it easier to handle the asynchronous nature of code. Together,
    these two features make writing asynchronous code feel more like writing synchronous 
    code*/


  /*  Asynchronous functions are prefixed with the async
  keyword; await suspends the execution until an asynchronous 
  function return promise is fulfilled and unwraps the value from the Promise returned.*/


  async register() {                
    console.log("register called");
    this.showAlert=true
    this.alertMsg="Please wait! Your account is being created."
    this.alertColor='blue'
    this.inSubmission=true

    try{
         await this.auth.createUser(this.registerForm.value)
      }
    catch(e){
        console.log(e)
        this.alertMsg="An unexpected error occured. Please try again later."
        this.alertColor='red'
        this.inSubmission=false
        return
    }
    this.alertMsg='Success! Your account has been created.'
    this.alertColor='green'

  }

}
