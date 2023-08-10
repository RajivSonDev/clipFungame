import { Component, OnInit } from '@angular/core';
import { EventBlockerDirective } from 'src/app/shared/directives/event-blocker.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid} from 'uuid';
import { last , switchMap} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{

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
    private auth:AngularFireAuth
  ){
      auth.user.subscribe(user=>this.user=user)
  }

  ngOnInit(): void {
      
  }

  storeFile($event:Event){
    this.isDragover=false;
    this.file=($event as DragEvent).dataTransfer?.files.item(0) ?? null

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

    this.showAlert=true
    this.alertColor='blue'
    this.alertMsg='Please wait! Your Clip is being uploaded'
    this.inSubmission=true
    console.log('file upload')
    const clipFileName = uuid()
    this.showPercentage = true
    const clipPath = `clips/${this.file?.name}.mp4`
    
    
    const task = this.storage.upload(clipPath,this.file)   // file will be upload from this function
    // above function is observable reqtune object
    const clipRef = this.storage.ref(clipPath)

    task.percentageChanges().subscribe(progress => {
      this.percent=progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(()=>clipRef.getDownloadURL())
      ).subscribe({
      next:(url)=>{
        const clip={
          uid:this.user?.uid,
          displayName:this.user?.displayName,
          title:this.title.value,
          fileName:`${clipFileName}.mp4`,
          url
        }

        console.log(clip)

        this.alertColor='green'
        this.alertMsg='Success! Your clip is now ready to share with Friends'
        this.showPercentage=false
      },
      error:(error)=>{
        this.alertColor='red',
        this.alertMsg= 'Upload Failed! Please try again later.'
        this.inSubmission=true
        this.showPercentage=false
        console.error(error)
      }
    })

  }

}
