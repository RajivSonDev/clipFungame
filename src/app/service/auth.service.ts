import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import IUser from '../model/user.model';
import { delay, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // AngularFirestoreCollection for typesafety
  private userCollection:AngularFirestoreCollection<IUser>
  public isAuthenticated$:Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>

  constructor(private auth:AngularFireAuth,
    private db:AngularFirestore) { 
      this.userCollection=db.collection('users')
      this.isAuthenticated$=auth.user.pipe(                                 // observable 
        map(user=>!!user)
      )
      this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(
        delay(1000)
      )
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

}
