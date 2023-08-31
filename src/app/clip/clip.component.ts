import { Component, OnInit, ViewChild, ElementRef , ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import Player from "video.js/dist/types/player";
import videojs from 'video.js';
import IClip from '../model/clip.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[DatePipe]
})
export class ClipComponent implements OnInit{

  @ViewChild('videoPlayer', {static:true}) target?:ElementRef  // because of static, 
  //it is will initilized before ngOnInit
  player?:Player
  clip?:IClip

  constructor(public route:ActivatedRoute){
  }


  ngOnInit(): void {
    this.player=videojs(this.target?.nativeElement);
   // this.id=this.route.snapshot.params.id

   this.route.data.subscribe(data =>{
    this.clip=data.clip as IClip
    console.log("clips is"+this.clip)

    this.player?.src({
      src:this.clip.url,
      type:'video/mp4'
    })

   })
  }


}
