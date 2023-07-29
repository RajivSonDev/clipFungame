import { Component, AfterContentInit, ContentChildren, QueryList, Query } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabsComponent) tabs?: QueryList<TabsComponent> = new QueryList() // projected content from parent to child

  constructor(){}

  ngAfterContentInit(): void {
    
    const activetabs=this.tabs?.filter(
      tab=>tab.active==true
    )

    if(!activetabs || activetabs?.length===0){
      this.selectTab(this.tabs!.first)               // ! it will be non null
    }

    this.tabs
    //console.log(this.tabs)
  }

  selectTab(tab:TabsComponent){
    this.tabs?.forEach(tab => {
        tab.active=false
    })

    tab.active=true
    return false 
  }

  

}
