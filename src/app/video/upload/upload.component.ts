import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventBlockerDirective } from 'src/app/shared/directives/event-blocker.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage , AngularFireUploadTask} from '@angular/fire/compat/storage';
import { v4 as uuid} from 'uuid';
import { last , switchMap} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ClipService } from 'src/app/service/clip.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy{

  isDragover = false
  file:File | null = null
  nextStep=false
  showAlert=false
  alertColor='blue'
  alertMsg='Please wait! Your Clip is being uploaded'
  inSubmission=false
  percent=0
  showPercentage=false
  user:any = null
  task?:AngularFireUploadTask

  title=new FormControl('',{
    validators:[
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable:true
  })
  uploadForm=new FormGroup({
    title:this.title
  })

  constructor(
    private storage:AngularFireStorage,
    private auth:AngularFireAuth,
    private clipService:ClipService,
    private router:Router
  ){
      auth.user.subscribe(user=>this.user=user)
  }

  ngOnDestroy(): void {
      
    this.task?.cancel()
  }

  storeFile($event:Event){
    this.isDragover=false;
    this.file=($event as DragEvent).dataTransfer?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0)?? null

    if(!this.file || this.file.type !== 'video/mp4'){
      return 
    }

    // changing input value
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
    )
    console.log(this.file)
    this.nextStep=true
  }


  uploadFile(){
    this.uploadForm.disable()
    this.showAlert=true
    this.alertColor='blue'
    this.alertMsg='Please wait! Your Clip is being uploaded'
    this.inSubmission=true
    console.log('file upload')
    const clipFileName = uuid()
    this.showPercentage = true
    const clipPath = `clips/${this.file?.name}.mp4`
    
    
    this.task = this.storage.upload(clipPath,this.file)   // file will be upload from this function
    // above function is observable reqtune object
    const clipRef = this.storage.ref(clipPath) // reference to video specific path

    this.task.percentageChanges().subscribe(progress => {
      this.percent=progress as number / 100
    }) 

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(()=>clipRef.getDownloadURL()) // getDownloadURL subscribe to observable 
      ).subscribe({
      next:async (url)=>{
        const clip={
          uid:this.user?.uid as string,
          displayName:this.user?.displayName as string,
          title:this.title.value,
          fileName:`${clipFileName}.mp4`,
          url,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()   // storing time stamp 
        }

        const clipDocRef = await this.clipService.createClip(clip) // taking reference 
        console.log(clip) 

        this.alertColor='green'
        this.alertMsg='Success! Your clip is now ready to share with Friends'
        this.showPercentage=false

        setTimeout(()=>{                    // starting Time out 
          this.router.navigate([
            'clip',clipDocRef.id
          ])
        },1000)


      },
      error:(error)=>{
        this.alertColor='red',
        this.uploadForm.enable( )
        this.alertMsg= 'Upload Failed! Please try again later.'
        this.inSubmission=true
        this.showPercentage=false
        console.error(error)
      }
    })


  }

}
