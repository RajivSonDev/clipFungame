import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output } from '@angular/core';
import { ModalService } from 'src/app/service/modal.service';
import IClip from 'src/app/model/clip.model';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/service/clip.service';
import { EventEmitter } from '@angular/core';
import { async } from '@firebase/util';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{

  @Input() activeClip: IClip | null = null;

  showAlert:boolean=false
  inSubmission=false
  alertColor='blue'
  alertMsg='Please wait! Updating Clip.'

  @Output() update = new EventEmitter()
 
  clipID = new FormControl('',{
    nonNullable:true
  })

  title=new FormControl('',{
    validators:[
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable:true
  })

  editForm=new FormGroup({
    title:this.title
  })

  constructor(private modal:ModalService, private clipService:ClipService){}


  ngOnInit(): void {
      this.modal.register('editClip')
  }

    
  ngOnDestroy(): void {
      //this.modal.unregister('editClip')
  }


  ngOnChanges(changes: SimpleChanges): void {
      if(!this.activeClip){
        return 
      }

    this.inSubmission=false
    this.showAlert=false
    console.log(this.activeClip.title)
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit(){

    if(!this.activeClip){
      return
    }

     this.inSubmission=true
     this.showAlert=true
     this.alertColor='blue'
     this.alertMsg='Please wait! Updating clip.'

     try{
      await this.clipService.updateClip(
        this.clipID.value, this.title.value
     )
    }
    catch(e){
      this.inSubmission=false
      this.alertColor='red'
      this.alertMsg='Something Went Wrong. Try again later'
      return 
    }

    this.activeClip.title=this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission=false
    this.alertColor='green'
    this.alertMsg='Success!'

  
    this.modal.toggleModal('editClip');

  }
}
