import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import IUser from '../model/user.model';
import { delay, map, filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router,  NavigationEnd } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // AngularFirestoreCollection for typesafety
  private userCollection:AngularFirestoreCollection<IUser>
  public isAuthenticated$:Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  public redirect = false

  constructor(private auth:AngularFireAuth,
    private db:AngularFirestore,
    private router:Router,
    private route:ActivatedRoute) { 
      this.userCollection=db.collection('users')
      this.isAuthenticated$=auth.user.pipe(                                 // observable 
        map(user=>!!user)
      )
      this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(
        delay(1000)
      )

      this.router.events.pipe(
        filter(e =>e instanceof NavigationEnd),
        map(e => this.route.firstChild) ,
        switchMap(route=>route?.data ?? of({authOnly:false}))   // ?? value is null or undefined
       ).subscribe((data)=>{
        this.redirect=data.authOnly ?? false;
       })
      //this.route.data.subscribe(console.log)
    }

  public async createUser(userData:any){

    if(!userData.password){
      throw new Error("Password not provided!")
    }

    const userCred=await this.auth.createUserWithEmailAndPassword(
      userData.email as string,userData.password as string)
   
    if(!userCred.user){
      throw new Error("User Can't be found")
    }  


    // set property will set the property
    await this.userCollection.doc(userCred.user?.uid).set({
      name:userData.name,
      email:userData.email,
      age:userData.age,
      phoneNumber:userData.phoneNumber
    })


    userCred.user.updateProfile({
      displayName:userData.name
    })

  }

  public async logout($event?:Event){            // it is asychronous process 
    
    if($event){
      $event.preventDefault()
    }
    await this.auth.signOut()         // wait for the process to get done

    if(this.redirect){
      await this.router.navigateByUrl('/')   
    }

   
  }

}
