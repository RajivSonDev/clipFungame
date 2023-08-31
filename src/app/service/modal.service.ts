import { Injectable } from '@angular/core';

interface IModal{
  id:string;
  visible:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  private modals:IModal[]=[]
  //private visible=false;

  constructor() { 

  }

  register(id:string){
    this.modals.push({
      id,
      visible:false
    });
  }

  isModalOpen(id:string):boolean{
    return !!this.modals.find(element=>element.id === id)?.visible
  }

  toggleModal(id:string){
    //this.visible=!this.visible
   const modal=this.modals.find(element=>element.id===id)
   console.log(modal)
   if(modal){
    modal.visible=!modal.visible
   }

  }
}
