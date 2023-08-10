import { Directive , HostListener} from '@angular/core';


// directive also allow to inject services 
@Directive({ 
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {

  constructor() { }

  // multiple evenet defualt behavior handling 

  @HostListener('drop',['$event'])
  @HostListener('dragover',['$event'])
  public handleEvent($event:Event){
    $event.preventDefault()
  }

  
}
