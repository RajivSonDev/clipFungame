import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ClipService } from '../service/clip.service';


@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]         // when you declare in provides it gets auto injected
})
export class ClipsListComponent implements OnInit, OnDestroy {

  @Input() scrollable = true;

  constructor(public clipService:ClipService){
    this.clipService.getClips() 
    console.log("vides :"+clipService.pageClips)
  }


  ngOnInit(): void {
    if(this.scrollable){
      window.addEventListener('scroll',this.handleScroll)  // to handle scrolling event
    }
  }

  ngOnDestroy(): void {
    if(this.scrollable){
      window.removeEventListener('scroll',this.handleScroll)  // Destroy scrolling event
    }

    this.clipService.pageClips=[]
  }


  handleScroll = () => {
   
    const {scrollTop, offsetHeight}= document.documentElement
    const {innerHeight} = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

    if(bottomOfWindow){
      console.log("Working")
     
      this.clipService.getClips()
    }
     
  }

}
