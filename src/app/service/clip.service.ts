import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../model/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of,BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class ClipService {

  // type checking always will be priority 
  public clipsCollection: AngularFirestoreCollection<IClip>


  constructor(
    private db:AngularFirestore,
    private auth:AngularFireAuth,
    private storage:AngularFireStorage
  ) {
    this.clipsCollection=db.collection('clips')  // firebase will be create collection for us ,
   }


   //async createClip(data:IClip) : Promise<DocumentReference<IClip>>{    // this async operation 
   // return await this.clipsCollection.add(data)  // set function let you set id, however add function will create id while inserting data in firebase
  // }


  createClip(data:IClip) : Promise<DocumentReference<IClip>>{    // this async operation 
    return this.clipsCollection.add(data)  // set function let you set id, however add function will create id while inserting data in firebase
   }
 
   getUserClip(sort$:BehaviorSubject<string>){
      return combineLatest([this.auth.user,sort$])
      .pipe(switchMap(values => {
          
        const [user,sort]=values

        if(!user){
            return of([])
          }

          const query = this.clipsCollection.ref.where(
            'uid','==',user.uid
          ).orderBy(
            'timestamp',
            sort==='1'?'desc':'asc'          )

          return query.get()
        }),
        map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
      );
   }

   async deleteClip(clip:IClip){   // we going to mak request 

      // a reference need to be create since we are going to intereatct with database
    const clipRef=this.storage.ref(`clips/${clip.fileName}`)

    await clipRef.delete()  // delete file the 

    await this.clipsCollection.doc(clip.docID).delete() // deleting from document

   }

   updateClip(id:string, title:string){

      return this.clipsCollection.doc(id).update({
        title
      })

   }

}
