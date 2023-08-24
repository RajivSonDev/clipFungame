import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
 

@Injectable({
  providedIn: 'root'
})
export class FfmpegService  {

  isRunning=false;
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


  // generating multiple screen shots
  async getScreenshots(file:File){

    this.isRunning=true

    const data= await fetchFile(file) // returning promise

    this.ffmpeg.FS('writeFile',file.name,data) // file system

    //console.log(data)

    const seconds=[1,2,4]
    const commands:string[]=[]

    seconds.forEach(second=>{
      commands.push(
       // Input 
      '-i',file.name,
      // Output Options
      '-ss', `00:00:${second}`,
      '-frames:v',
      '1',
      '-filter:v',
      'scale=510:-1',
      // Output
      `output_0${second}.png`
      )
    })


    await this.ffmpeg.run(
      ...commands
    )
    

    const screenshots:string[]=[]

    seconds.forEach(second =>{
      const screenShortFile = this.ffmpeg.FS('readFile',`output_0${second}.png`)
      const screenshotBlob = new Blob(
        [screenShortFile.buffer], {
          type:'image/png'
        }
      )

      const screenshotURL = URL.createObjectURL(screenshotBlob)
      console.log(screenshotURL)
      screenshots.push(screenshotURL)

    })

    this.isRunning=false;

    return screenshots
  }

  

}
