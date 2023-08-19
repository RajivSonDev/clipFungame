import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,Params} from '@angular/router';
import { ClipService } from 'src/app/service/clip.service';
import IClip from 'src/app/model/clip.model';
import { ModalService } from 'src/app/service/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  videoOrder='1';
  clips: IClip[] = []
  activeClip:IClip | null = null
  sort$:BehaviorSubject<string>

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private clipService:ClipService,
    private modal:ModalService
    ){
      this.sort$=new BehaviorSubject(this.videoOrder);
    }

  sort(event:Event){
    const {value}=(event?.target as HTMLSelectElement)

    //this.router.navigateByUrl(`/manage?sort=${value}`)
    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{
        sort:value
      }
    }) 
  }

  ngOnInit(): void {
 
    this.route.queryParamMap.subscribe((params:Params)=>{
      this.videoOrder=params.sort == '2 '? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })

    this.clipService.getUserClip(this.sort$).subscribe(docs => {
      this.clips = []

      docs.forEach(doc => {
        this.clips.push({
          docID:doc.id,
          ...doc.data()
        })
      })
    })

  }

  openModal($event:Event,clip:IClip){
    $event.preventDefault()
    this.activeClip=clip
    //console.log(this.activeClip)
    this.modal.toggleModal('editClip')

  }

  update($event:IClip){
    this.clips.forEach((element,index)=>{
      if(element.docID===$event.docID){
        this.clips[index].title=$event.title
      }
    })

  }

  deleteClip($event:Event, clip:IClip){
    $event.preventDefault();
    this.clipService.deleteClip(clip);
    
    this.clips.forEach((element,index) =>{
      if(element.docID==clip.docID){
        this.clips.slice(index,1)
      }
    })

  }

 

}
