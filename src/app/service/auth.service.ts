import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection:AngularFirestoreCollection<IUser>

  constructor(private auth:AngularFireAuth,
    private db:AngularFirestore) { 
      this.userCollection=db.collection('users')
    }

  public async createUser(userData:any){

    if(!userData.password){
      throw new Error("Password not provided!")
    }

    const userCred=await this.auth.createUserWithEmailAndPassword(
      userData.email as string,userData.password as string)
   
      
    await this.userCollection.add({
      name:userData.name,
      email:userData.email,
      age:userData.age,
      phoneNumber:userData.phoneNumber
    })
  }

}
