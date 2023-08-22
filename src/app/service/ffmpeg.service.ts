import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  isReady=false;
  private ffmpeg

  constructor(
  ) { 
    this.ffmpeg=createFFmpeg({
      log:true
    })
  }

  async init(){
    if(this.isReady){
      return 
    }

  await this.ffmpeg.load()
  this.isReady=true
    
  }

  async getScreenshots(file:File){

    const data= await fetchFile(file)

    this.ffmpeg.FS('writeFile',file.name,data) // file system

    const seconds = [1, 2 , 3]
    const commands : string[] = []

    seconds.forEach(seconds => {
      commands.push(
         // Input 
        '-i',file.name,
        //output options
        '-ss',`00:00:0${seconds}`,
        '-frame:v','1',
        '-filter:v','scale=510:-1',
        //Output 
        `output_0${seconds}.png`
      )
    })

    // get screen shoot

    await this.ffmpeg.run(
      ...commands
    )

    const screenshorts : string[]= []

    seconds.forEach(seconds => {
        const screenshortFile  = this.ffmpeg.FS('readFile', `output_0${seconds}.png`)
        const screenshortBlob = new Blob([screenshortFile.buffer],{
          type:'image/png'
        })
    
    const screenshotURL = URL.createObjectURL(screenshortBlob)

    screenshorts.push(screenshotURL)

    })

    return screenshorts

  }

}
